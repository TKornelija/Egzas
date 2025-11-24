import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminFAQEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loading) return <p>Kraunama...</p>;

  return (
    <div className="admin-faq-container">
      <h2 className="admin-faq-title">Redaguoti klausimą</h2>

      <form class="faqform" onSubmit={handleSave}  style={{ padding: 20 }}>

        <label>Klausimas:</label>
        <input type="text" value={question} disabled className="input" />

        <label>Atsakymas:</label>
        <textarea
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={makePublic}
            onChange={() => setMakePublic(!makePublic)}
          />
          Viešas
        </label>

        <button className="btn btn--primary" style={{ marginTop: 20 }}>
          Išsaugoti
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          style={{ marginTop: 20, color: "red" }}
          onClick={handleDelete}
        >
          Ištrinti klausimą
        </button>
      </form>
    </div>
  );
}
