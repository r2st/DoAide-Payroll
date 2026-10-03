const BASE = "/api/v1";
const TOKEN_KEY = "doaide_payroll_token";
const _fallback = new Map();
let _onUnauthorized = null;

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return _fallback.get(TOKEN_KEY) || null;
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    if (token) _fallback.set(TOKEN_KEY, token);
    else _fallback.delete(TOKEN_KEY);
  }
}

export function onUnauthorized(fn) {
  _onUnauthorized = fn;
}

async function request(method, path, { body, params } = {}) {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, v);
    });
  }
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), opts);
  if (res.status === 401) {
    setToken(null);
    _onUnauthorized?.();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, ...err };
  }
  if (res.status === 204) return null;
  return res.json();
}

export function errorMessage(err) {
  if (typeof err === "string") return err;
  if (err?.detail) {
    if (typeof err.detail === "string") return err.detail;
    if (Array.isArray(err.detail))
      return err.detail.map((e) => e.msg || JSON.stringify(e)).join("; ");
  }
  if (err?.error?.message) return err.error.message;
  if (err?.message) return err.message;
  return "Something went wrong.";
}

const api = {
  login: async (email, password) => {
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    const res = await request("POST", "/auth/login", { body: form });
    setToken(res.access_token);
    return res;
  },
  register: async (data) => {
    const res = await request("POST", "/auth/register", { body: data });
    setToken(res.token.access_token);
    return res;
  },
  logout: () => setToken(null),
  me: () => request("GET", "/auth/me"),

  employees: {
    list: (params) => request("GET", "/employees", { params }),
    get: (id) => request("GET", `/employees/${id}`),
    create: (data) => request("POST", "/employees", { body: data }),
    update: (id, data) => request("PUT", `/employees/${id}`, { body: data }),
    delete: (id) => request("DELETE", `/employees/${id}`),
    getSalary: (id) => request("GET", `/employees/${id}/salary`),
    setSalary: (id, data) => request("POST", `/employees/${id}/salary`, { body: data }),
  },

  payroll: {
    listRuns: () => request("GET", "/payroll/runs"),
    createRun: (data) => request("POST", "/payroll/runs", { body: data }),
    getRun: (id) => request("GET", `/payroll/runs/${id}`),
    computeRun: (id) => request("POST", `/payroll/runs/${id}/compute`),
    approveRun: (id) => request("POST", `/payroll/runs/${id}/approve`),
    getPayslip: (id) => request("GET", `/payroll/payslips/${id}`),
    downloadPayslipPdf: (id) => `${BASE}/payroll/payslips/${id}/pdf`,
  },

  leaves: {
    list: (params) => request("GET", "/leaves", { params }),
    create: (data) => request("POST", "/leaves", { body: data }),
    action: (id, data) => request("PUT", `/leaves/${id}/action`, { body: data }),
    getBalances: (params) => request("GET", "/leaves/balances", { params }),
    initializeBalances: (params) =>
      request("POST", "/leaves/balances/initialize", { params }),
  },

  reports: {
    monthly: (params) => request("GET", "/reports/monthly", { params }),
    compliance: () => request("GET", "/reports/compliance"),
  },

  health: {
    check: () => request("GET", "/health"),
  },
};

export default api;
