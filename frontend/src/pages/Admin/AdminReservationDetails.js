import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Reservations.css";
import { useI18n } from "../../lib/i18n";


export default function AdminReservationDetails() {
  const { t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
const STATUS_OPTIONS = [t("resDetails.waiting"), t("resDetails.done"), t("resDetails.cancelled")];

  const [reservation, setReservation] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/reservations/${id}`);
      const data = await res.json();
      setReservation(data);
      setStatus(data.status);
      setLoading(false);
    }
    load();
  }, [id]);

  async function updateStatus() {
    await fetch(`/api/reservations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    alert("Statusas atnaujintas");
  }

  if (loading) return <p>{t("resDetails.loading")}</p>;
  if (!reservation) return <p>{t("resDetails.none")}</p>;

  return (
    <div className="admin-reservations-container">
      <button onClick={() => navigate(-1)} className="admin-reservations-back">
        {t("resDetails.back")}
      </button>

      <h2 className="admin-reservations-title">Rezervacija #{reservation._id}</h2>

      <div className="admin-reservation-card">
        <h3>{("resDetails.status")}</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-reservation-status-select"
        >
          {STATUS_OPTIONS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>

        <button onClick={updateStatus} className="btn btn--primary">
          {t("resDetails.save")}
        </button>
      </div>

      <div className="admin-reservation-card">
        <h3>{t("resDetails.user")}</h3>
        <p>{t("resDetails.email")}{reservation.userId?.email || "-"}</p>
      </div>

      <div className="admin-reservation-card">
        <h3>{t("resDetails.data")}</h3>
        <p>{t("resDetails.id")} {reservation.costumeId}</p>
        <p>{t("resDetails.size")} {reservation.size}</p>
        <p>{t("resDetails.from")} {new Date(reservation.from).toLocaleDateString()}</p>
        <p>{t("resDetails.iki")}{new Date(reservation.to).toLocaleDateString()}</p>
        <p>{t("resDetails.sum")} {reservation.total} €</p>
      </div>
    </div>
  );
}
