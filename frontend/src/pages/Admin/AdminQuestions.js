import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Adminfaq.css";

export default function AdminFAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/question");
      const data = await res.json();
      setFaq(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Kraunama...</p>;

  return (
    <div className="admin-faq-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 className="admin-faq-title">Klausimų sąrašas</h2>
        <Link to="/admin/faq/new" className="btn btn--primary">
          + Naujas klausimas
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Klausimas</th>
            <th>Atsakymas</th>
            <th>Viešas</th>
            <th>Veiksmai</th>
          </tr>
        </thead>

        <tbody>
          {faq.map((q, i) => (
            <tr key={q._id}>
              <td>{i + 1}</td>
              <td>{q.question}</td>
              <td>{q.answer ? q.answer : <em>Nėra atsakymo</em>}</td>
              <td>{q.public ? "Taip" : "Ne"}</td>
              <td>
                <Link to={`/admin/faq/${q._id}`} className="order-link">
                  Redaguoti
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
