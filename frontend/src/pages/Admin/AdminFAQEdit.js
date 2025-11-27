import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../lib/i18n";

export default function AdminFAQEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [makePublic, setMakePublic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/question/${id}`);
      const data = await res.json();

      setQuestion(data.question);
      setAnswer(data.answer);
      setMakePublic(data.public);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();

    await fetch(`/api/question/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, makePublic }),
    });

    navigate("/admin/faq");
  }

  async function handleDelete() {
    if (!window.confirm("Ar tikrai norite ištrinti šį klausimą?")) return;

    await fetch(`/api/question/${id}`, { method: "DELETE" });

    navigate("/admin/faq");
  }

  if (loading) return <p>{t("faqAdmin.loading")}</p>;

  return (
    <div className="admin-faq-container">
      <h2 className="admin-faq-title">{t("faqAdmin.edit")}</h2>

      <form class="faqform" onSubmit={handleSave}>

        <label>{t("faqAdmin.question")}</label>
        <input type="text" value={question} disabled className="input" />

        <label>{t("faqAdmin.answer")}</label>
        <textarea
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={makePublic}
            onChange={() => setMakePublic(!makePublic)}
          />
          {t("faqAdmin.visability")}
        </label>
        <div>
        <button className="btn btn--primary">
          {t("faqAdmin.save")}
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={handleDelete}
        >
          {t("faqAdmin.delete")}
          
        </button>
        </div>
      </form>
    </div>
  );
}
