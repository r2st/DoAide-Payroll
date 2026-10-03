"""Application configuration, loaded from environment / .env."""
from __future__ import annotations

from functools import lru_cache

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEFAULT_JWT_SECRET = "change-me-to-a-long-random-string"
_MIN_JWT_SECRET_LENGTH = 32
_MIN_PRODUCTION_BCRYPT_ROUNDS = 10
_PRODUCTION_LIKE = frozenset({"production", "prod", "staging", "stage"})


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "DoAide Payroll"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: str = "http://localhost:5173,http://localhost:3000"
    docs_enabled: bool = True

    log_level: str = "INFO"
    log_format: str = "console"

    trust_proxy_headers: bool = False
    hsts_enabled: bool = False

    jwt_secret: str = _DEFAULT_JWT_SECRET
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    bcrypt_rounds: int = Field(default=12, ge=4, le=31)

    database_url: str = "postgresql+psycopg://payroll:payroll@localhost:5432/payroll"
    db_pool_size: int = Field(default=10, ge=1, le=100)
    db_max_overflow: int = Field(default=5, ge=0, le=100)
    db_pool_timeout: int = Field(default=30, ge=1, le=300)
    db_pool_recycle: int = Field(default=1800, ge=60)
    db_echo: bool = False
    db_statement_timeout_seconds: int = Field(default=30, ge=0, le=600)

    redis_url: str = "redis://localhost:6379/0"

    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "openai/gpt-oss-20b:free"
    openrouter_app_url: str = "https://payroll.doaide.com"
    openrouter_app_title: str = "DoAide Payroll"
    openrouter_timeout_seconds: float = 90.0

    upload_dir: str = "./data/uploads"
    max_upload_mb: int = 15

    plan_monthly_employee_limits: str = "free=10,starter=100,pro=0"

    @field_validator("access_token_expire_minutes", "max_upload_mb")
    @classmethod
    def _positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("must be positive")
        return v

    @field_validator("environment")
    @classmethod
    def _normalised_environment(cls, v: str) -> str:
        return v.strip().lower() or "development"

    @field_validator("log_level")
    @classmethod
    def _known_log_level(cls, v: str) -> str:
        level = v.strip().upper()
        if level not in {"CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG", "NOTSET"}:
            raise ValueError(f"LOG_LEVEL must be one of CRITICAL/ERROR/WARNING/INFO/DEBUG, got '{v}'")
        return level

    @field_validator("log_format")
    @classmethod
    def _known_log_format(cls, v: str) -> str:
        fmt = v.strip().lower()
        if fmt not in {"json", "console"}:
            raise ValueError(f"LOG_FORMAT must be 'json' or 'console', got '{v}'")
        return fmt

    @field_validator("jwt_algorithm")
    @classmethod
    def _supported_algorithm(cls, v: str) -> str:
        algorithm = v.strip().upper()
        if algorithm not in {"HS256", "HS384", "HS512"}:
            raise ValueError(f"JWT_ALGORITHM must be HS256, HS384 or HS512, got '{v}'")
        return algorithm

    @field_validator("database_url")
    @classmethod
    def _known_database(cls, v: str) -> str:
        url = v.strip()
        if not url:
            raise ValueError("DATABASE_URL must be set")
        if not url.startswith(("postgresql", "sqlite")):
            raise ValueError(f"DATABASE_URL must be a postgresql:// or sqlite:// URL (got '{url.split(':', 1)[0]}')")
        return url

    @model_validator(mode="after")
    def _production_invariants(self) -> Settings:
        if not self.is_production:
            return self
        if self.jwt_secret == _DEFAULT_JWT_SECRET:
            raise ValueError("JWT_SECRET must be set to a strong random value in production.")
        if len(self.jwt_secret) < _MIN_JWT_SECRET_LENGTH:
            raise ValueError(f"JWT_SECRET must be at least {_MIN_JWT_SECRET_LENGTH} characters in production.")
        if self.bcrypt_rounds < _MIN_PRODUCTION_BCRYPT_ROUNDS:
            raise ValueError(f"BCRYPT_ROUNDS must be at least {_MIN_PRODUCTION_BCRYPT_ROUNDS} in production.")
        if self.debug:
            raise ValueError(f"DEBUG must be false when ENVIRONMENT={self.environment}.")
        origins = self.cors_origins
        if not origins:
            raise ValueError("BACKEND_CORS_ORIGINS must name at least one origin in production.")
        if "*" in origins:
            raise ValueError("BACKEND_CORS_ORIGINS must list explicit origins in production.")
        return self

    @property
    def is_production(self) -> bool:
        return self.environment in _PRODUCTION_LIKE

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.backend_cors_origins.split(",") if o.strip()]

    @property
    def plan_limits(self) -> dict[str, int]:
        limits: dict[str, int] = {}
        for chunk in self.plan_monthly_employee_limits.split(","):
            name, _, raw = chunk.partition("=")
            name = name.strip().lower()
            if not name:
                continue
            try:
                limits[name] = int(raw)
            except ValueError:
                continue
        return limits

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

    @property
    def max_request_bytes(self) -> int:
        return self.max_upload_bytes + 1024 * 1024

    def startup_report(self) -> dict[str, object]:
        return {
            "app_name": self.app_name,
            "app_version": self.app_version,
            "environment": self.environment,
            "debug": self.debug,
            "database": redact_url(self.database_url),
            "cors_origins": self.cors_origins,
            "docs_enabled": self.docs_enabled,
            "log_level": self.log_level,
            "ai_configured": bool(self.openrouter_api_key),
        }


def redact_url(url: str) -> str:
    if "://" not in url:
        return url
    scheme, _, rest = url.partition("://")
    if "@" not in rest:
        return url
    credentials, _, host = rest.rpartition("@")
    user, sep, _ = credentials.partition(":")
    return f"{scheme}://{user}{':***' if sep else ''}@{host}"


def validate_startup_config(settings_obj: Settings | None = None) -> list[str]:
    current = settings_obj or get_settings()
    found: list[str] = []
    if not current.openrouter_api_key:
        found.append("OPENROUTER_API_KEY is not set — AI features will be limited.")
    if current.is_production and not current.trust_proxy_headers:
        found.append("TRUST_PROXY_HEADERS is false — all clients may share one rate-limit bucket.")
    elif current.jwt_secret == _DEFAULT_JWT_SECRET:
        found.append("JWT_SECRET is the sample value. Fine locally; production will refuse it.")
    return found


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
