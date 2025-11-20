import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Orders.css";

export default function AdminOrders() {
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

  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (error) return <p className="orders-error">{error}</p>;
  if (!orders.length) return <p className="orders-empty">Dar nėra pateiktų užsakymų.</p>;

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Orders</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Items</th>
            <th>Delivery</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, idx) => (
            <tr key={o._id || idx}>
              <td>{idx + 1}</td>
              <td>
                {o._id ? (
                  <Link to={`/admin/orders/${o._id}`} className="order-link">
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
                    <span className="order-muted">{o.customer.email}</span>
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

              <td className="order-price">
                {typeof o.totalAmount === "number"
                  ? o.totalAmount.toFixed(2) + " €"
                  : "-"}
              </td>

              <td className="order-muted">
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
