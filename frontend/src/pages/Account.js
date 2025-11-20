import { useState, useEffect, useMemo } from "react";
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
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  
  useEffect(() => {
    async function loadOrders() {
      if (!user?.token) return;

      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    }

    loadOrders();
  }, [user]);

  useEffect(() => {
  async function loadReservations() {
    if (!user?.token) return;

    const res = await fetch("/api/reservations/my", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();
    setReservations(data);
  }

  loadReservations();
}, [user]);

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
          {reservations.length === 0 && (
    <p>Šiuo metu rezervacijų nėra.</p>
  )}

  {reservations.length === 0 && (
    <p>Šiuo metu rezervacijų nėra.</p>
  )}

  {reservations.map(r => (
    <div key={r._id} className="reservation-box" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      
      {/* NUOTRAUKA */}
      <img 
        src={r.costume?.image || "/no-image.png"} 
        alt={r.costume?.name || "Kostiumas"} 
        style={{ width: 90, height: 90, borderRadius: 8, objectFit: "cover" }} 
      />

      <div>
        <div><strong>{r.costume?.name || ("Kostiumas #" + r.costumeId)}</strong></div>
        <div>Nuo: {new Date(r.from).toLocaleDateString()}</div>
        <div>Iki: {new Date(r.to).toLocaleDateString()}</div>
        <div>Dydis: {r.size}</div>
        <div>Suma: {r.total} €</div>
        <div>Būsena: {r.status}</div>
      </div>

    </div>
  ))}
        </section>

        <section className="card section">
          <h2 className="title">Užsakymai</h2>
          {orders.length === 0 && (
    <p>Užsakymų dar nėra. Kai tik pateiksite užsakymą, jis atsiras čia.</p>
  )}

  {orders.map(order => (
    <div key={order._id} className="order-box">
      <div><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
      <div><strong>Suma:</strong> {order.totalAmount} €</div>
      <div><strong>Mokėjimo būdas:</strong> {order.paymentMethod}</div>

      <ul style={{ marginTop: 10 }}>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.title} — {item.quantity} vnt × {item.price} €
          </li>
        ))}
      </ul>
    </div>
  ))}
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
