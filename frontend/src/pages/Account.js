import { useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/account.css";

function inicialaiIsElpasto(email) {
  if (!email) return "U";
  const p = email.split("@")[0];
  const parts = p.split(/[._-]/).filter(Boolean);
  const first = parts[0]?.[0] || p[0];
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

export default function Account() {
  const nav = useNavigate();
  const { user, logout } = useAuthContext();

  const inic = useMemo(() => inicialaiIsElpasto(user?.email), [user]);
  if (!user) return null;

  return (
    <div className="account">
      <h1>Mano paskyra</h1>

      {/* Profilio juosta */}
      <div
        className="card"
        style={{ display: "flex", alignItems: "center", gap: 16 }}
      >
        <div className="avatar" aria-label="avatar">
          {inic}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="muted">Prisijungta kaip</div>
          <div style={{ fontSize: 16, marginTop: 2 }}>{user.email}</div>
        </div>

        <div className="actions">
          <Link to="/cart" className="btn">
            🛒 Krepšelis
          </Link>
          <Link to="/costumes" className="btn">
            🎭 Kolekcija
          </Link>
          <button
            onClick={() => {
              logout();
              nav("/");
            }}
            className="btn btn--primary"
          >
            🔥 Atsijungti
          </button>
        </div>
      </div>

      {/* Skyriai */}
      <div className="row" style={{ marginTop: 16 }}>
        <section className="card section">
          <h2 className="title">Rezervacijos</h2>
          <p>
            Šiuo metu rezervacijų nėra.{" "}
            <Link to="/costumes" className="link">
              Peržiūrėti kostiumus
            </Link>
            .
          </p>
        </section>

        <section className="card section">
          <h2 className="title">Užsakymai</h2>
          <p>
            Užsakymų dar nėra. Kai tik pateiksite užsakymą, jis atsiras čia.
          </p>
        </section>

        <section className="card section" style={{ gridColumn: "1 / -1" }}>
          <h2 className="title">Paskyros nustatymai</h2>
          <ul>
            <li>
              El. paštas: <strong>{user.email}</strong>
            </li>
            <li>
              Slaptažodžio keitimą pridėsime vėliau (saugus srautas į backend).
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
