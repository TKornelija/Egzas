import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/api";
import { useI18n } from "../lib/i18n";
import { addItem } from "../lib/Cart";
import "../styles/costumeDetails.css";

export default function CostumeDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { t } = useI18n();
  const navigate = useNavigate();

  const initialMode = params.get("mode") === "buy" ? "buy" : "rent";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "" });
  const [reviewError, setReviewError] = useState("");

  const [mode, setMode] = useState(initialMode);
  const [size, setSize] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [qty, setQty] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet(`/api/costumes/${id}`);
        setItem(data);

        const reviewData = await apiGet(`/api/costumes/${id}/reviews`);
        setReviews(reviewData);
      } catch (e) {
        console.error(e);
        setError(t("details.errorLoad") || "Nepavyko gauti kostiumo duomenų.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, t]);

  const rentTotal = days * (item?.rentalPrice || 0);
  const buyTotal = qty * (item?.price || 0);

  const isRentValid = mode === "rent" ? size && from && to && days > 0 : true;
  const isBuyValid = mode === "buy" ? size && qty >= 1 : true;
  const canSubmit = isRentValid && isBuyValid;

  async function handleReserve() {
    setError("");
    try {
      if (mode === "rent") {
        if (!canSubmit)
          return setError(
            t("details.fillAll") || "Įveskite visus reikalingus duomenis."
          );

        const reservation = await apiPost("/api/reservations", {
          costumeId: id,
          from,
          to,
          size,
        });

        alert(`Rezervacija sėkmingai sukurta!\nID: ${reservation._id}`);
      } else {
        if (!size)
          return setError(t("details.sizeRequired") || "Pasirinkite dydį.");

        addItem({
          id,
          name: item.name,
          size,
          qty,
          price: item.price,
          imageUrl: item.imageUrls?.[0] || "/images/no-image.png",
        });
        setShowAddedModal(true);
      }
    } catch (e) {
      setError(e.message || t("details.requestError"));
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError("");
    if (!newReview.text) return setReviewError(t("details.commentRequired"));
    try {
      const res = await apiPost(`/api/costumes/${id}/reviews`, {
        text: newReview.text,
        costumeId: id,
      });
      setReviews((prev) => [...prev, res]);
      setNewReview({ text: "" });
    } catch (e) {
      setReviewError(e.message || t("details.reviewError"));
    }
  }

  function prevImage() {
    setCurrentImage((prev) =>
      prev === 0 ? item.imageUrls.length - 1 : prev - 1
    );
  }
  function nextImage() {
    setCurrentImage((prev) =>
      prev === item.imageUrls.length - 1 ? 0 : prev + 1
    );
  }

  if (loading)
    return (
      <div className="container">
        <p>{t("details.loading")}</p>
      </div>
    );

  if (error || !item)
    return (
      <div className="container">
        <p>{error || t("details.notFound")}</p>
        <Link className="btn btn--ghost" to="/costumes">
          {t("details.back")}
        </Link>
      </div>
    );

  return (
    <div className="container">
      <Link to="/costumes" className="btn btn--ghost back-btn">
        ← {t("details.back")}
      </Link>

      <div className="costume-grid">
        {/* Carousel */}
        <div className="carousel-wrapper">
          <div
            className="carousel-image"
            style={{ backgroundImage: `url(${item.imageUrls[currentImage]})` }}
          />
          <button className="carousel-arrow left" onClick={prevImage}>
            ◀
          </button>
          <button className="carousel-arrow right" onClick={nextImage}>
            ▶
          </button>
        </div>

        {/* Details */}
        <div className="details">
          <h1>{item.name}</h1>
          <p className="price-line">
            {t(
              "details.priceLine",
              formatCurrency(item.rentalPrice),
              formatCurrency(item.price)
            )}
          </p>

          <div className="tabs">
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

          {item.size?.length > 0 && (
            <div className="sizes-section">
              <div className="sizes-title">{t("details.sizes")}:</div>
              <div className="sizes-list">
                {item.size.map((s) => (
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
          )}

          {mode === "rent" ? (
            <div className="rent-section">
              <label>
                {t("details.from")}:
                <input
                  type="date"
                  min={today}
                  value={from}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected < today) return;
                    setFrom(selected);
                  }}
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
                {t("details.total")}:{" "}
                <strong>{formatCurrency(rentTotal)}</strong>{" "}
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
                {t("details.total")}:{" "}
                <strong>{formatCurrency(buyTotal)}</strong>
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

        {/* Description */}
        <div className="product-description">
          <h2>{t("details.description")}</h2>
          <p>{item.description}</p>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>{t("details.reviews")}</h2>
          {reviews.length === 0 ? (
            <p>{t("details.noReviews")}</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-card">
                <p>{r.text}</p>
                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}

          <form onSubmit={submitReview} className="review-form">
            <h3>{t("details.leaveReview")}</h3>
            <textarea
              placeholder={t("details.commentPlaceholder")}
              value={newReview.text}
              onChange={(e) =>
                setNewReview({ ...newReview, text: e.target.value })
              }
            />
            {reviewError && <div className="error-text">{reviewError}</div>}
            <button type="submit" className="btn btn--primary">
              {t("details.send")}
            </button>
          </form>
        </div>
      </div>

      {showAddedModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#181818",
              padding: 32,
              borderRadius: 16,
              textAlign: "center",
              width: "90%",
              maxWidth: 420,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginBottom: 12 }}>Prekė įdėta į krepšelį!</h2>
            <p style={{ opacity: 0.85, marginBottom: 24 }}>
              Ką norėtumėte daryti toliau?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                className="btn btn--primary"
                onClick={() => navigate("/cart")}
              >
                Peržiūrėti krepšelį
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setShowAddedModal(false)}
              >
                Tęsti apsipirkimą
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
