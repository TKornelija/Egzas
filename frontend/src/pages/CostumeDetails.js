import { useParams, Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { apiPost } from "../lib/api";
import { useI18n } from "../lib/i18n";


const MOCK = {
  c1: {
    id: "c1",
    title: "Vampire Queen",
    pricePerDay: 40,
    priceBuy: 120,
    sizes: ["S", "M", "L"],
  },
  c2: {
    id: "c2",
    title: "Dark Nun",
    pricePerDay: 35,
    priceBuy: 100,
    sizes: ["M", "L"],
  },
  c3: {
    id: "c3",
    title: "Devil Mistress",
    pricePerDay: 45,
    priceBuy: 140,
    sizes: ["S", "M"],
  },
};

export default function CostumeDetails() {
  const { t } = useI18n();
  const { id } = useParams();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "buy" ? "buy" : "rent";

  const item = MOCK[id];
  const [mode, setMode] = useState(initialMode);
  const [size, setSize] = useState(item?.sizes?.[0] ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  // today's date
  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const days = useMemo(() => {
    if (!from || !to) return 0;
    const d1 = new Date(from),
      d2 = new Date(to);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [from, to]);

  if (!item)
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <p style={{ marginBottom: 20 }}>Not found.</p>
        <Link className="btn btn--ghost" to="/costumes">
          {t("details.back")}
        </Link>
      </div>
    );

  const rentTotal = days * item.pricePerDay;
  const buyTotal = qty * item.priceBuy;

  const isRentValid = mode === "rent" ? size && from && to && days > 0 : true;
  const isBuyValid = mode === "buy" ? size && qty >= 1 : true;
  const canSubmit = isRentValid && isBuyValid;

  async function handleReserve() {
    setError("");
    try {
      if (mode === "rent") {
        if (!canSubmit)
          return setError(t("details.reservedMsg", item.title, from, to, days));
        const res = await apiPost("/api/reservations", {
          costumeId: id,
          from,
          to,
          size,
        });
        alert(
          `🎉 Reservation #${res.id}\n${res.from} → ${res.to}\n${t(
            "details.total"
          )}: $${res.total}`
        );
      } else {
        const order = await apiPost("/api/purchase", {
          costumeId: id,
          qty,
          size,
        });
        alert(
          `🧾 Order #${order.id}\nQty: ${order.qty}\n${t("details.total")}: $${
            order.total
          }`
        );
      }
    } catch (e) {
      setError(e.message || "Request failed");
    }
  }

  return (
    <div className="container" style={{ padding: "60px 0" }}>
      <Link
        to="/costumes"
        className="btn btn--ghost"
        style={{ marginBottom: 24 }}
      >
        ← {t("details.back")}
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at center, #1a1a1a 0%, #0e0e0e 100%)",
            borderRadius: 16,
            height: 450,
            boxShadow: "0 0 20px rgba(255,255,255,0.05)",
          }}
        />

        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 10 }}>{item.title}</h1>
          <p style={{ color: "#bbb", marginBottom: 16 }}>
            {t("details.priceLine", item.pricePerDay, item.priceBuy)}
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setMode("rent")}
              className={`btn ${
                mode === "rent" ? "btn--primary" : "btn--ghost"
              }`}
            >
              {t("details.rent")}
            </button>
            <button
              onClick={() => setMode("buy")}
              className={`btn ${
                mode === "buy" ? "btn--primary" : "btn--ghost"
              }`}
            >
              {t("details.buy")}
            </button>
          </div>

          {/* Sizes */}
          <div className="sizes-section">
            <div className="sizes-title">{t("details.sizes")}:</div>
            <div className="sizes-list">
              {item.sizes.map((s) => (
                <button
                  key={s}
                  className={`btn btn--ghost size-btn ${
                    s === size ? "active" : ""
                  }`}
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {mode === "rent" ? (
            <div className="rent-section">
              <label>
                {t("details.from")}:
                <input
                  type="date"
                  min={today}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="input-date"
                />
              </label>

              <label>
                {t("details.to")}:
                <input
                  type="date"
                  min={from || today}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-date"
                />
              </label>

              <div className="total-line">
                {t("details.total")}: <strong>${rentTotal || 0}</strong>{" "}
                {days ? `(${days} ${t("details.days")})` : ""}
              </div>
            </div>
          ) : (
            <div className="rent-section">
              <label>
                {t("details.qty")}:
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="input-date"
                />
              </label>

              <div className="total-line">
                {t("details.total")}: <strong>${buyTotal}</strong>
              </div>
            </div>
          )}

          {error && <div className="error-text">{error}</div>}

          <button
            className={`btn reserve-btn ${canSubmit ? "active" : "disabled"}`}
            onClick={handleReserve}
            disabled={!canSubmit}
          >
            {mode === "rent" ? t("details.reserve") : t("details.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
