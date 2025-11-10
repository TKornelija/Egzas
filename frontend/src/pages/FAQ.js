import React from "react";
import AskQuestionForm from "../components/AskQuestionForm";
import Accordion from "../components/Accordion";
import { useI18n } from "../lib/i18n";
import AdminQuestions from "../components/AdminQuestions";

export default function FAQ() {
   const { t } = useI18n();
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>{t("faq.name")}</h1>

      {/* Viešas akordeonas su atsakytais klausimais */}
      <Accordion />

      {/* Lankytojo klausimų forma */}
      <AskQuestionForm />
    </div>
  );
}
