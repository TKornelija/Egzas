import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../lib/api";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answerText, setAnswerText] = useState("");

  const fetchQuestions = async () => {
    try {
      const res = await apiGet("/api/question");
      setQuestions(res.filter(q => !q.public)); 
    } catch (err) {
      console.error("Klaida gaunant klausimus:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = async (id, makePublic = false) => {
    try {
      await apiPut(`/api/question/${id}`, { answer: answerText, makePublic });
      setAnswerText("");
      fetchQuestions();
    } catch (err) {
      console.error("Klaida atsakant į klausimą:", err);
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <h3>Administratorius: atsakyti į klausimus</h3>
      {questions.map((q) => (
        <div key={q._id} style={{ marginBottom: "20px" }}>
          <p><strong>Klausimas:</strong> {q.question}</p>
          <input
            type="text"
            placeholder="Įveskite atsakymą"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{ width: "60%", marginRight: "10px" }}
          />
          <button onClick={() => handleAnswer(q._id)}>Atsakyti</button>
        </div>
      ))}
    </div>
  );
}
