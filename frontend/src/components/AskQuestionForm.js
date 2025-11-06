import { useState } from "react";
import { apiPost } from "../lib/api";
import "../styles/Accordion.css";
import { useI18n } from "../lib/i18n";

export default function AskQuestionForm() {
  const { t } = useI18n();

  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/api/question", { question, askedBy: email });
      setStatus("Žinutė sėkmingai išsiųsta!");
      setQuestion("");
      setEmail("");
    } catch (err) {
      setStatus("Įvyko klaida, pabandykite vėliau.");
      console.error(err);
    }
  };

  return (
    <div className="ask-question-container">
      <h3>Neradai atsakymo? Užduok klausimą:</h3>
      <form onSubmit={handleSubmit} className="ask-question-form">
        <input
          type="email"
          placeholder="Jūsų el. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Įveskite klausimą"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        ></textarea>
        <button type="submit">Siųsti</button>
      </form>
      {status && <p className="ask-question-status">{status}</p>}
    </div>
  );
}
