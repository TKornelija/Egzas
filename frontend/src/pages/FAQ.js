import React from "react";
import AskQuestionForm from "../components/AskQuestionForm";
import Accordion from "../components/Accordion";
import AdminQuestions from "../components/AdminQuestions";

export default function FAQ() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Dažniausiai užduodami klausimai</h1>

      {/* Viešas akordeonas su atsakytais klausimais */}
      <Accordion />

      {/* Lankytojo klausimų forma */}
      <AskQuestionForm />
    </div>
  );
}
