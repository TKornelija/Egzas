import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../../lib/api";
import { useI18n } from "../../lib/i18n";

export default function AdminCostumes() {
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useI18n();

  async function load() {
    try {
      setLoading(true);
      const data = await apiGet("/api/costumes");
      setCostumes(data);
    } catch (e) {
      setError("Nepavyko įkelti kostiumų.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Ar tikrai norite ištrinti kostiumą?")) return;

    try {
      await apiDelete(`/api/costumes/${id}`);
      setCostumes((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert("Klaida trinant kostiumą.");
    }
  }

  if (loading) return <p>{t("costumesAdmin.loading")}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <h2>{t("costumesAdmin.edit")}</h2>
        <Link className="btn btn--primary" to="/admin/costumes/add">
          {t("costumesAdmin.add")}
        </Link>
      </div>

      {costumes.length === 0 ? (
        <p>{t("costumesAdmin.none")}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("costumesAdmin.id")}</th>
              <th>{t("costumesAdmin.name")}</th>
              <th>{t("costumesAdmin.price")}</th>
              <th>{t("costumesAdmin.rent")}</th>
              <th>{t("costumesAdmin.quantity")}</th>
              <th>{t("costumesAdmin.action")}</th>
            </tr>
          </thead>
          <tbody>
            {costumes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.price} €</td>
                <td>{c.rentalPrice} €</td>
                <td>{c.quantity}</td>
                <td>
                  <Link className="btn btn--ghost" to={`/admin/costumes/${c.id}`}>
                    {t("costumesAdmin.change")}
                  </Link>
                  <button
                    className="btn btn--danger"
                    onClick={() => handleDelete(c.id)}
                    style={{ marginLeft: 10 }}
                  >
                    {t("costumesAdmin.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
