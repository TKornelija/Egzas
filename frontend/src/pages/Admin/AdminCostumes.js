import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../../lib/api";

export default function AdminCostumes() {
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Kraunama</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Kostiumų valdymas</h2>
        <Link className="btn btn--primary" to="/admin/costumes/add">
          Pridėti naują kostiumą
        </Link>
      </div>

      {costumes.length === 0 ? (
        <p>Šiuo metu nėra kostiumų.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pavadinimas</th>
              <th>Kaina</th>
              <th>Nuomos kaina</th>
              <th>Kiekis</th>
              <th>Veiksmai</th>
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
                    Redaguoti
                  </Link>
                  <button
                    className="btn btn--danger"
                    onClick={() => handleDelete(c.id)}
                    style={{ marginLeft: 10 }}
                  >
                    Ištrinti
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
