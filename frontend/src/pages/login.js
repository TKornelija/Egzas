import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { getUser, login, logout, subscribeAuth, notifyAuth } from "../lib/auth";

export default function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [user, setUser] = useState(getUser());
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => subscribeAuth(setUser), []);

  function handleLogin(e){
    e.preventDefault();
    setErr("");
    if(!email || !email.includes("@")) return setErr("Enter a valid email.");
    if(!pwd || pwd.length < 3)        return setErr("Password too short.");
    const u = login({ email });
    notifyAuth();
    nav("/"); // grįžtam į pradžią po login
  }

  function handleLogout(){
    logout();
    notifyAuth();
    setUser(null);
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
