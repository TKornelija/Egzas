import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { user, login: contextLogin, logout: contextLogout } = useAuthContext();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin(e){
    e.preventDefault();
    setErr("");
    if(!email || !email.includes("@")) return setErr("Enter a valid email.");
    if(!pwd || pwd.length < 3)        return setErr("Password too short.");

    // call backend login
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
      });
      const data = await res.json();
      if(!res.ok) return setErr(data.error || 'Login failed');

      // store in context (and localStorage via context)
      contextLogin(data);
      nav('/');
    } catch (err) {
      console.error(err);
      setErr('Network error');
    }
  }

  function handleLogout(){
    contextLogout();
  }

  if (user) {
    return (
      <div className="container" style={{ padding: "48px 0" }}>
        <h1 style={{ marginBottom: 8 }}>{t("nav.login")}</h1>
        <p style={{ opacity:.8, marginBottom: 18 }}>You are logged in as <strong>{user.name}</strong> ({user.email})</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn--ghost" onClick={()=>nav("/cart")}>🛒 {t("nav.cart")}</button>
          <button className="btn btn--primary" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "48px 0", maxWidth: 520 }}>
      <h1 style={{ marginBottom: 8 }}>{t("nav.login")}</h1>
      <p style={{ opacity:.8, marginBottom: 18 }}>Sign in to manage your reservations and orders.</p>

      <form onSubmit={handleLogin} style={{ display:"grid", gap:12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            style={{ display:"block", width:"100%", marginTop:6, background:"#181818", color:"#fff", border:"1px solid #333", borderRadius:8, padding:"10px 12px" }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={pwd}
            onChange={e=>setPwd(e.target.value)}
            required
            style={{ display:"block", width:"100%", marginTop:6, background:"#181818", color:"#fff", border:"1px solid #333", borderRadius:8, padding:"10px 12px" }}
          />
        </label>

        {err && <div style={{ color:"#ff6b6b" }}>{err}</div>}

        <button className="btn btn--primary" type="submit" style={{ padding:"12px 14px" }}>
          {t("nav.login")}
        </button>
      </form>

      <div style={{ marginTop:14, fontSize:14, opacity:.8 }}>
        No account? <Link to="/signup" className="footer__link">Create one</Link>
      </div>
    </div>
  );
}
