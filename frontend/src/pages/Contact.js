import { useI18n } from "../lib/i18n";
import "../styles/contact.css";

export default function Contact() {
  const { t } = useI18n();

  return (
    <div className="contact-container">
      <h1>{t("contact.title")}</h1>

      <div className="contact-grid">
        {/* Kairė pusė – informacija */}
        <div className="contact-info">
          <h2>{t("contact.company")}</h2>
          <p>
            <strong>{t("contact.code")}:</strong> 305678901
          </p>
          <p>
            <strong>{t("contact.vat")}:</strong> LT100012345678
          </p>

          <div className="contact-details">
            <p>
              <strong>{t("contact.phone")}:</strong>{" "}
              <a href="tel:+37060012345">+370 600 12345</a>
            </p>
            <p>
              <strong>{t("contact.email")}:</strong>{" "}
              <a href="mailto:info@freakortreat.lt">info@freakortreat.lt</a>
            </p>
            <p>
              <strong>{t("contact.address")}:</strong> Vilniaus g. 10, Vilnius, Lietuva
            </p>
          </div>

          <p className="contact-note">{t("contact.note")}</p>
        </div>

        <div className="contact-map">
          <iframe
            title="Freak Or Treat location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2307.981193719345!2d25.2796512!3d54.6893861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd940c47d83b3f%3A0x9f3a4d5c4f0f08d8!2sVilniaus%20g.%2010%2C%20Vilnius!5e0!3m2!1sen!2slt!4v1699999999999!5m2!1sen!2slt"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}