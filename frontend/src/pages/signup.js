import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useI18n } from "../lib/i18n";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(email, password);
      
      if (result && !result.error) {
        setSuccess(true);
        setTimeout(() => nav("/login"), 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const getMessage = () => {
    const lang = t("nav.signup");
    if (lang === "Sign up") return "Registration successful!";
    if (lang === "Регистрация") return "Регистрация прошла успешно!";
    return "Jūsų registracija sėkminga!";
  };

  return (
    <div className="container" style={{ padding: "48px 0", maxWidth: 520 }}>
      <h1 style={{ marginBottom: 8 }}>{t("nav.signup")}</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        {t("nav.signup") === "Sign up"
          ? "Create a new account to start using the site."
          : t("nav.signup") === "Регистрация"
          ? "Создайте новый аккаунт, чтобы начать пользоваться сайтом."
          : "Sukurkite naują paskyrą norėdami naudotis svetaine."}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              background: "#181818",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              background: "#181818",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          />
        </label>

        {error && (
          <div style={{ color: "#ff6b6b" }}>
            {t("nav.signup") === "Sign up"
              ? "Error during registration."
              : t("nav.signup") === "Регистрация"
              ? "Ошибка при регистрации."
              : "Klaida registruojantis."}
          </div>
        )}
        {success && (
          <div style={{ color: "#4ade80" }}>
            {getMessage()}{" "}
            {t("nav.signup") === "Sign up"
              ? "Redirecting to login..."
              : t("nav.signup") === "Регистрация"
              ? "Переадресация на вход..."
              : "Nukreipiama į prisijungimo puslapį..."}
          </div>
        )}

        <button
          className="btn btn--primary"
          type="submit"
          disabled={isLoading}
          style={{ padding: "12px 14px" }}
        >
          {isLoading
            ? t("nav.signup") === "Sign up"
              ? "Registering..."
              : t("nav.signup") === "Регистрация"
              ? "Регистрация..."
              : "Registruojama..."
            : t("nav.signup")}
        </button>
      </form>

      <div style={{ marginTop: 14, fontSize: 14, opacity: 0.8 }}>
        {t("nav.signup") === "Sign up"
          ? "Already have an account?"
          : t("nav.signup") === "Регистрация"
          ? "Уже есть аккаунт?"
          : "Jau turite paskyrą?"}{" "}
        <Link to="/login" className="footer__link">
          {t("nav.login")}
        </Link>
      </div>
    </div>
  );
}