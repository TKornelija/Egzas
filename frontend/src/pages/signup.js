import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [klaida, setKlaida] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setKlaida("");

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setKlaida(data.error);
      return;
    }

    contextLogin(data);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h1>Registruotis</h1>
      <p className="subtext">Sukurkite naują paskyrą norėdami tęsti.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>El. paštas</label>
        <input
          type="email"
          value={email}
          placeholder="Įveskite el. paštą"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Slaptažodis</label>
        <input
          type="password"
          value={password}
          placeholder="Įveskite slaptažodį"
          onChange={(e) => setPassword(e.target.value)}
        />

        {klaida && <p className="error">{klaida}</p>}

        <button type="submit" className="btn-primary">
          Registruotis
        </button>
      </form>

      <div className="auth-footer">
        Jau turite paskyrą?{" "}
        <Link to="/login" className="link">
          Prisijungti
        </Link>
      </div>
    </div>
  );
}

