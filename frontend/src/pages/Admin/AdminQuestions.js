import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Adminfaq.css";
import { useI18n } from "../../lib/i18n";


export default function AdminFAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/question");
      const data = await res.json();
      setFaq(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>{t("faqAdminMain.loading")}</p>;

  return (
    <div className="admin-faq-container">
      <div>
        <h2 className="admin-faq-title">{t("faqAdminMain.tittle")}</h2>
        <Link to="/admin/faq/new" className="btn btn--primary">
          {t("faqAdminMain.new")}
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("faqAdminMain.question")}</th>
            <th>{t("faqAdminMain.answer")}</th>
            <th>{t("faqAdminMain.visability")}</th>
            <th>{t("faqAdminMain.action")}</th>
          </tr>
        </thead>

        <tbody>
          {faq.map((q, i) => (
            <tr key={q._id}>
              <td>{i + 1}</td>
              <td>{q.question}</td>
              <td>{q.answer ? q.answer : <em>{t("faqAdminMain.none")}</em>}</td>
              <td>{q.public ? "Taip" : "Ne"}</td>
              <td>
                <Link className="btn btn--ghost" to={`/admin/faq/${q._id}`}>
                  {t("faqAdminMain.edit")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
