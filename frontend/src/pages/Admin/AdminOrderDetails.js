import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Orders.css";

const STATUS_OPTIONS = [
  "užsakymas pateiktas",
  "užsakymas atšauktas",
  "užsakymas išsiųstas",
  "užsakymas pristatytas",
  "užsakymas paruoštas atsiimti",
];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Nepavyko gauti užsakymo");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status || STATUS_OPTIONS[0]);
      } catch (e) {
        setError(e.message || "Klaida kraunant užsakymą");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSaveStatus() {
    try {
      setSavingStatus(true);

      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepavyko atnaujinti būsenos");
      }

      const updated = await res.json();
      setOrder(updated);
    } catch (e) {
      alert(e.message || "Klaida atnaujinant būseną");
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading) return <p className="orders-loading">Kraunamas užsakymas...</p>;
  if (error) return <p className="orders-error">{error}</p>;
  if (!order) return <p className="orders-empty">Užsakymas nerastas.</p>;

  const customer = order.customer || {};
  const items = order.items || [];
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("lt-LT")
    : "-";

  const orderShortId = order._id?.slice(-6).toUpperCase() || id;

  const badgeClass = {
    "užsakymas pateiktas": "status-pill--submitted",
    "užsakymas atšauktas": "status-pill--cancelled",
    "užsakymas išsiųstas": "status-pill--shipped",
    "užsakymas pristatytas": "status-pill--delivered",
    "užsakymas paruoštas atsiimti": "status-pill--ready",
  }[status];

  return (
    <div className="admin-orders-container">
      <button
        className="admin-order-back"
        onClick={() => navigate(-1)}
        type="button"
      >
        Grįžti į užsakymų sąrašą
      </button>

      <div className="admin-order-header">
        <div>
          <h2 className="admin-orders-title">Užsakymas #{orderShortId}</h2>
          <div className="admin-order-sub">
            Sukurtas: <span>{createdAt}</span>
          </div>
          {order.userId?.email && (
            <div className="admin-order-sub">
              Kliento paskyra: <span>{order.userId.email}</span>
            </div>
          )}
        </div>

        <div className="admin-order-badges">
          <div className="admin-order-badge">
            <span className="label">Apmokėjimas:</span>
            <span className="value">{order.paymentMethod || "-"}</span>
          </div>
          <div className="admin-order-badge">
            <span className="label">Pristatymas:</span>
            <span className="value">{order.deliveryMethod || "-"}</span>
          </div>
          {order.storeLocation && (
            <div className="admin-order-badge">
              <span className="label">Atsiėmimo vieta:</span>
              <span className="value">{order.storeLocation}</span>
            </div>
          )}
        </div>
      </div>

      <section className="admin-order-card">
        <h3>Užsakymo būsena</h3>

        <div className="admin-order-status-row">
          <div className={`admin-order-status-pill ${badgeClass}`}>
            <span className="admin-order-status-label">Būsena:</span>
            <span className="admin-order-status-value">{status}</span>
          </div>

          <select
            className="admin-order-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleSaveStatus}
            disabled={savingStatus || status === order.status}
            className="btn btn--primary"
          >
            {savingStatus ? "Saugoma..." : "Išsaugoti"}
          </button>
        </div>
      </section>

      <div className="admin-order-grid">
        <section className="admin-order-card">
          <h3>Klientas</h3>
          <div className="admin-order-card-body">
            <div className="order-line">
              <span className="order-label">Vardas, pavardė:</span>
              <span className="order-value">
                {`${customer.firstName || ""} ${
                  customer.lastName || ""
                }`.trim() || "-"}
              </span>
            </div>

            <div className="order-line">
              <span className="order-label">El. paštas:</span>
              <span className="order-value">{customer.email || "-"}</span>
            </div>
          </div>
        </section>

        <section className="admin-order-card">
          <h3>Kliento adresas</h3>
          <div className="admin-order-card-body">
            <div className="order-line">
              <span className="order-label">Adresas:</span>
              <span className="order-value">
                {customer.address || customer.adress || "-"}
              </span>
            </div>

            <div className="order-line">
              <span className="order-label">Pašto kodas:</span>
              <span className="order-value">
                {customer.postalCode || "-"}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-order-card">
        <h3>Užsakytos prekės</h3>

        {items.length ? (
          <table className="admin-order-products">
            <thead>
              <tr>
                <th>Prekė</th>
                <th className="orders-cell-small">Kiekis</th>
                <th className="orders-cell-small">Kaina</th>
                <th className="orders-cell-small">Suma</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, i) => {
                const qty = it.quantity || 0;
                const price = it.price || 0;

                return (
                  <tr key={i}>
                    <td>
                      <strong>{it.title}</strong>
                    </td>
                    <td className="orders-cell-small">{qty}</td>
                    <td className="orders-cell-small">{price.toFixed(2)} €</td>
                    <td className="orders-cell-small order-price">
                      {(qty * price).toFixed(2)} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="order-muted">Prekių nėra.</p>
        )}
      </section>

      <section className="admin-order-card admin-order-summary">
        <div className="admin-order-summary-row">
          <span>Iš viso:</span>
          <span className="admin-order-summary-total">
            {order.totalAmount?.toFixed(2)} €
          </span>
        </div>
      </section>
    </div>
  );
}
