import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Adminfaq.css";
import { useI18n } from "../../lib/i18n";

export default function AdminFAQNew() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [makePublic, setMakePublic] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();


    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const saved = await res.json();

    
    if (answer) {
      await fetch(`/api/question/${saved._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, makePublic }),
      });
    }

    navigate("/admin/faq");
  }

  return (
    <div className="admin-faq-container">
      <h2 className="admin-faq-title">{t("faqAdmin.edit")}</h2>

      <form class="faqform" onSubmit={handleSubmit}>
        <label>{t("faqAdmin.question")}</label>
        <input
          type="text"
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label>{t("faqAdmin.answer")}</label>
        <textarea
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={makePublic}
            onChange={() => setMakePublic(!makePublic)}
          />{" "}
          {t("faqAdmin.visability")}
        </label>

        <button className="btn btn--primary">
          {t("faqAdmin.delete")}
        </button>
      </form>
    </div>
  );
}
