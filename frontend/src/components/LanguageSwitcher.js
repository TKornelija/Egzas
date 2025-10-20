import { useI18n } from "../lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div style={{ display:"flex", gap:8 }}>
      {["lt","en","ru"].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="btn"
          style={{
            padding:"6px 10px",
            border:"1px solid #444",
            background: lang===l ? "#e04646" : "transparent",
            color:"#fff",
            borderRadius:8
          }}
          aria-pressed={lang===l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
