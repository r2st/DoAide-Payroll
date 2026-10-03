"""Structured logging configuration."""
from __future__ import annotations

import logging
import sys


def configure_logging(level: str = "INFO", fmt: str = "console") -> None:
    root = logging.getLogger()
    root.setLevel(getattr(logging, level, logging.INFO))

    if root.handlers:
        return

    handler = logging.StreamHandler(sys.stdout)
    if fmt == "json":
        formatter = logging.Formatter(
            '{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","message":"%(message)s"}'
        )
    else:
        formatter = logging.Formatter("%(asctime)s %(levelname)-8s %(name)s — %(message)s")
    handler.setFormatter(formatter)
    root.addHandler(handler)
