import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { errorMessage } from "../lib/api";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  usePageTitle(tab === "login" ? "Sign In" : "Register");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
            Register
          </button>
        </div>
        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      {error && <div className="alert alert-error">{error}</div>}
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", company_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      {error && <div className="alert alert-error">{error}</div>}
      <label>Full Name<input value={form.full_name} onChange={update("full_name")} required /></label>
      <label>Email<input type="email" value={form.email} onChange={update("email")} required /></label>
      <label>Password<input type="password" value={form.password} onChange={update("password")} required minLength={8} /></label>
      <label>Company Name<input value={form.company_name} onChange={update("company_name")} required minLength={2} /></label>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
