import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import "../../styles/Orders.css";

export default function AdminOrders() {
  const { t } = useI18n();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/orders/all");
        if (!res.ok) throw new Error("Nepavyko gauti užsakymų");
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        setError(e.message || "Klaida kraunant užsakymus");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="orders-loading">{t("adminOrders.loading")}</p>;
  if (error) return <p className="orders-error">{error}</p>;
  if (!orders.length)
    return <p className="orders-empty">{t("adminOrders.empty")}</p>;

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">{t("adminOrders.title")}</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("adminOrders.id")}</th>
            <th>{t("adminOrders.customer")}</th>
            <th>{t("adminOrders.address")}</th>
            <th>{t("adminOrders.items")}</th>
            <th>{t("adminOrders.delivery")}</th>
            <th>{t("adminOrders.payment")}</th>
            <th>{t("adminOrders.status")}</th>
            <th>{t("adminOrders.created")}</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, idx) => {
            const currentStatus = o.status || "užsakymas pateiktas";

            return (
              <tr key={o._id || idx}>
                <td>{idx + 1}</td>

                <td>
                  {o._id ? (
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="order-link"
                    >
                      {o._id}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {o.customer
                    ? (
                        `${o.customer.firstName || ""} ${
                          o.customer.lastName || ""
                        }`.trim() || "-"
                      )
                    : "-"}
                  {o.customer?.email && (
                    <>
                      <br />
                      <span className="order-muted">
                        {o.customer.email}
                      </span>
                    </>
                  )}
                </td>

                <td>
                  {o.customer?.address && <div>{o.customer.address}</div>}
                  {o.customer?.postalCode && <div>{o.customer.postalCode}</div>}
                  {!o.customer?.address && !o.customer?.postalCode && "-"}
                </td>

                <td>
                  {o.items?.length
                    ? o.items.map((it, i) => (
                        <div key={i} className="order-item-line">
                          {it.title} x{it.quantity} ({it.price} €)
                        </div>
                      ))
                    : "-"}
                </td>

                <td>{o.deliveryMethod || "-"}</td>
                <td>{o.paymentMethod || "-"}</td>

                <td>
                  <span className="order-status-badge">
                    {currentStatus}
                  </span>
                </td>

                <td className="order-muted">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
