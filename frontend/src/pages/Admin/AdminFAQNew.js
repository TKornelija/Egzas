import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Adminfaq.css";

export default function AdminFAQNew() {
  const navigate = useNavigate();

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
      <h2 className="admin-faq-title">Naujas klausimas</h2>

      <form class="faqform" onSubmit={handleSubmit}  style={{ padding: 20 }}>
        <label>Klausimas:</label>
        <input
          type="text"
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label>Atsakymas (nebūtinas):</label>
        <textarea
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={makePublic}
            onChange={() => setMakePublic(!makePublic)}
          />{" "}
          Padaryti viešą
        </label>

        <button className="btn btn--primary"  style={{ marginTop: 20 }}>
          Išsaugoti
        </button>
      </form>
    </div>
  );
}
