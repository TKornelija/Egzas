import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLogin } from "../lib/adminAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
  const r = await fetch("/api/admin_users/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pwd }),
    });
    const data = await r.json();
    if (!r.ok) return setErr(data.error || "Login failed");

    adminLogin({ token: data.token, email: data.email, role: data.role }); // <-- пишем в admin
    const to = (loc.state && loc.state.from?.pathname) || "/admin";
    nav(to, { replace: true });
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h1>Admin login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" required />
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
