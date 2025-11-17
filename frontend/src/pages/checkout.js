import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { getItems, total } from "../lib/cart";
import "../styles/Checkout.css";

export default function Checkout() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Krepšelio būsena
  const [items, setItems] = useState([]);
  const [sum, setSum] = useState(0);

  // Pasirinkimai
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [storeLocation, setStoreLocation] = useState("");

  // Pranešimas
  const [success, setSuccess] = useState(false);

  console.log("User:", user);
  console.log("Token:", user?.token);

  const deliveryOptions = ["DPD kurjeris", "DPD paštomatas", "Atsiėmimas parduotuvėje"];
  const paymentOptions = ["PayPal", "Mastercard", "Apple Pay", "Mokėjimas parduotuvėje"];
  const storeOptions = ["Siaubo g. 12", "Košmarų g. 45"];

  // Peradresavimas į login, jei neprisijungęs
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  // Užkraunam krepšelio duomenis
  useEffect(() => {
    const list = getItems();
    setItems(list);
    setSum(total(list));
  }, []);

  async function submitOrder() {
    if (!user?.token) {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.token) {
        user.token = stored.token;
      } else {
        alert("Jūsų sesija baigėsi. Prisijunkite iš naujo.");
        navigate("/login");
        return;
      }
    }

    const reservationsRaw = JSON.parse(localStorage.getItem("reservations")) || [];
    const reservationIds = reservationsRaw.map(r => r.reservationId);

    const orderData = {
      items,
      reservations: reservationIds,
      deliveryMethod,
      storeLocation,
      paymentMethod,
      totalAmount: sum + reservationsRaw.reduce((a, r) => a + (r.total || 0), 0),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("cart");
      localStorage.removeItem("reservations");

      setSuccess(true);
    } else {
      alert(data.error || "Įvyko klaida");
    }
  }

  if (!user) return null;

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Apmokėjimas</h1>

      {/* Pristatymo būdas */}
      <section className="checkout-section">
        <h2 className="section-title">Pasirinkite pristatymo būdą</h2>
        <div className="options-group">
          {deliveryOptions.map((method) => (
            <label
              key={method}
              className={`option ${deliveryMethod === method ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="delivery"
                value={method}
                checked={deliveryMethod === method}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              />
              <span>{method}</span>
            </label>
          ))}

          {deliveryMethod === "Atsiėmimas parduotuvėje" && (
            <div className="store-selector">
              <label htmlFor="store">Pasirinkite parduotuvę:</label>
              <select
                id="store"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
              >
                <option value="">-- Pasirinkite adresą --</option>
                {storeOptions.map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Mokėjimo būdas */}
      <section className="checkout-section">
        <h2 className="section-title">Pasirinkite mokėjimo būdą</h2>
        <div className="options-group">
          {paymentOptions.map((method) => (
            <label
              key={method}
              className={`option ${paymentMethod === method ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Užsakymo santrauka */}
      <section className="checkout-summary">
        <h2 className="section-title">Užsakymo santrauka</h2>
        <p><strong>Pristatymas:</strong> {deliveryMethod || "Nepasirinkta"}</p>
        {deliveryMethod === "Atsiėmimas parduotuvėje" && storeLocation && (
          <p><strong>Parduotuvė:</strong> {storeLocation}</p>
        )}
        <p><strong>Mokėjimas:</strong> {paymentMethod || "Nepasirinkta"}</p>

        <div className="checkout-total">
          <strong>Mokėtina suma:</strong> {sum.toFixed(2)} €  
        </div>

        <button
          disabled={
            !deliveryMethod ||
            !paymentMethod ||
            (deliveryMethod === "Atsiėmimas parduotuvėje" && !storeLocation)
          }
          className="checkout-button"
          onClick={submitOrder}
        >
          Tęsti apmokėjimą
        </button>
      </section>

      {/* MODALAS */}
      {success && (
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
            zIndex: 2000,
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
            <h2 style={{ marginBottom: 12 }}>Užsakymas pavyko!</h2>
            <p style={{ opacity: 0.85, marginBottom: 24 }}>
              Ačiū, kad apsipirkote FreakOrTreat 🎃
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                className="btn btn--primary"
                onClick={() => navigate("/")}
              >
                Grįžti į pradžią
              </button>

              <button
                className="btn btn--ghost"
                onClick={() => setSuccess(false)}
              >
                Uždaryti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
