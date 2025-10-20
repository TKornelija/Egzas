import { useI18n } from "../lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer style={{ padding:"24px 0", marginTop:40, borderTop:"1px solid #171717", background:"#0f0f0f" }}>
      <div className="container" style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <a href="#">{t("footer.returns")}</a>
        <a href="#">{t("footer.shipping")}</a>
        <a href="#">{t("footer.faq")}</a>
        <a href="#">{t("footer.privacy")}</a>
        <a href="#">{t("footer.terms")}</a>
        <a href="#">{t("footer.contact")}</a>
      </div>
    </footer>
  );
}
