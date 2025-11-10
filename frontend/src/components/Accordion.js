import { useEffect, useState, useRef } from "react";
import { apiGet } from "../lib/api";
import { useI18n } from "../lib/i18n";
import "../styles/Accordion.css";

export default function Accordion() {
  const [faqItems, setFaqItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const panelRefs = useRef([]);
  const { t } = useI18n();

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await apiGet("/api/question/public"); // gauname tik viešus klausimus
        if (res.length > 0) {
          setFaqItems(res);
        } else {
          // Jei viešų klausimų dar nėra, rodome testinius
          setFaqItems([
            {
              _id: "test1",
              question: t("accordion.testOne"),
              answer: t("accordion.answerOne"),
            },
            {
              _id: "test2",
              question: t("accordion.testTwo"),
              answer: t("accordion.answerTwo"),
            },
          ]);
        }
      } catch (err) {
        console.error("Klaida gaunant FAQ:", err);
        // Jei klaida, taip pat rodome testinius klausimus
        setFaqItems([
          {
            _id: "test1",
            question: t("accordion.testOne"),
            answer: t("accordion.answerOne"),
          },
          {
            _id: "test2",
            question: t("accordion.testTwo"),
            answer: t("accordion.answerTwo"),
          },
        ]);
      }
    };
    fetchFaq();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    panelRefs.current.forEach((panel, idx) => {
      if (panel) {
        panel.style.maxHeight =
          activeIndex === idx ? panel.scrollHeight + "px" : "0px";
      }
    });
  }, [activeIndex, faqItems]);

  return (
    <div className="accordion-container">
      {faqItems.map((item, index) => (
        <div key={item._id} className="accordion-item">
          <button
            className={`accordion-button ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => toggleAccordion(index)}
          >
            {item.question}
          </button>
          <div
            ref={(el) => (panelRefs.current[index] = el)}
            className={`accordion-panel ${activeIndex === index ? "open" : ""}`}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
