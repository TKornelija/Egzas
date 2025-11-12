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

  const deliveryOptions = ["DPD kurjeris", "DPD paštomatas", "Atsiėmimas parduotuvėje"];
  const paymentOptions = ["PayPal", "Mastercard", "Apple Pay", "Mokėjimas parduotuvėje"];
  const storeOptions = ["Siaubo g. 12", "Košmarų g. 45"];

  // 👇 Peradresavimas į login, jei neprisijungęs
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  // 👇 Užkraunam krepšelio duomenis
  useEffect(() => {
    const list = getItems();
    setItems(list);
    setSum(total(list));
  }, []);

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

          {/* Jei atsiėmimas parduotuvėje */}
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

        {/* 👇 Čia rodome mokėtiną sumą */}
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
        >
          Tęsti apmokėjimą
        </button>
      </section>
    </div>
  );
}
