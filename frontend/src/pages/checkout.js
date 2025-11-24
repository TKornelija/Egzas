import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import  { getItems, total, clearCart } from "../lib/cart";
import { useI18n } from "../lib/i18n";
import "../styles/Checkout.css";

export default function Checkout() {
  const { t } = useI18n();
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [adress, setAdress]= useState("");
  const [postalCode, setPostalCode] = useState("");
  

  // Pranešimas
  const [success, setSuccess] = useState(false);

  console.log("User:", user);
  console.log("Token:", user?.token);

  const deliveryOptions = [t("checkout.checkoutMethodOne"), t("checkout.checkoutMethodSecond"), t("checkout.checkoutMethodThird")];
  const paymentOptions = [t("checkout.paymentOne"), t("checkout.paymentTwo"), t("checkout.paymentThree"), t("checkout.paymentFour")];
  const storeOptions = [t("checkout.storeOne"), t("checkout.storeSecond")];

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
  
  //prekiu isfiltravimas
  const cartItems = getItems();

const reservationItems = cartItems.filter(i => i.type === "reservation");
const purchaseItems = cartItems.filter(i => i.type !== "reservation");

  async function submitOrder() {
    
 // Patikrinam, ar turim vartotoją ir tokeną
  if (!user?.token) {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.token) {
      user.token = stored.token;
    } else {
      alert(t("checkout.alert"));
      navigate("/login");
      return;
    }
  }

  // Atskiriam krepšelio elementus:  rezervacijos ir pirkiniai
  const reservationItems = items.filter((i) => i.type === "reservation");
  const purchaseItems = items.filter((i) => i.type !== "reservation");

  //rezervacijos issiunciamos i rezervacijas
  try {
    for (let r of reservationItems) {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          costumeId: r.id,
  from: r.from,
  to: r.to,
  size: r.size,

        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Rezervacijos klaida:", data);
        alert(data.message || "Nepavyko sukurti rezervacijos.");
        return;
      }
    }
  } catch (err) {
    console.error(err);
    alert("Klaida siunčiant rezervacijas.");
    return;
  }

  // pirkinius issiunciam i orders
  if (purchaseItems.length > 0) {
    const orderTotal = purchaseItems.reduce(
      (sum, it) => sum + (it.price ?? 0) * (it.qty ?? 1),
      0
    );

    const orderData = {
      items: purchaseItems.map((it) => ({
        title: it.name || it.title || `Prekė #${it.id}`,
        price: it.price,
        quantity: it.qty,
      })),
      deliveryMethod,
      storeLocation,
      paymentMethod,
      totalAmount: orderTotal,
      customer: {
       firstName,
       lastName,
       email,
       postalCode,
       adress
  }
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Orderio klaida:", data);
      alert(data.error || "Nepavyko sukurti užsakymo.");
      return;
    }
  }

  //krepselis isvalomas, rodoma, kad pirkimas pavyko
  clearCart();
  setSuccess(true);
}

  if (!user) return null;

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">{t("checkout.payment")}</h1>
      
    {/*Pirkejo duomenys*/}
  <section className="checkout-section">
  <h2 className="section-title">{t("checkout.buyer")}</h2>

  <h2 className="form-title">{t("checkout.name")}</h2>
  <div className="form-group">
    <input
      type="text"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      placeholder={t("checkout.nameForm")}
      required
    />
  </div>

  <h2 className="form-title">{t("checkout.surname")}</h2>
  <div className="form-group">
    <input
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      placeholder={t("checkout.surnameForm")}
      required
    />
  </div>

  <h2 className="form-title">{t("checkout.mail")}</h2>
  <div className="form-group">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={t("checkout.mailForm")}
      required
    />
  </div>

  <h2 className="form-title">{t("checkout.adress")}</h2>
  <div className="form-group">
    <input
      type="text"
      value={adress}
      onChange={(e) => setAdress(e.target.value)}
      placeholder={t("checkout.adressForm")}
      required
    />
  </div>
  
    <h2 className="form-title">{t("checkout.postCode")}</h2>
    <div className="form-group">
    <input
      type="text"
      value={postalCode}
      onChange={(e) => setPostalCode(e.target.value)}
      placeholder={t("checkout.postCodeForm")}
      required
    />
  </div>

  </section>

      {/* Pristatymo būdas */}
      <section className="checkout-section">
        <h2 className="section-title">{t("checkout.deliveringMethod")}</h2>
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

          {deliveryMethod === t("checkout.checkoutMethodThird") && (
            <div className="store-selector">
              <label htmlFor="store">{t("checkout.shop")}</label>
              <select
                id="store"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
              >
                <option value="">{t("checkout.shopAdress")}</option>
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
        <h2 className="section-title">{t("checkout.paymentMethod")}</h2>
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
        <h2 className="section-title">{t("checkout.orderSummary")}</h2>
        <p><strong>{t("checkout.shipment")}</strong> {deliveryMethod || t("checkout.notChosen")}</p>
        {deliveryMethod === t("checkout.checkoutMethodThird") && storeLocation && (
          <p><strong>{t("checkout.shopOne")}</strong> {storeLocation}</p>
        )}
        <p><strong>{t("checkout.paymentSummary")}</strong> {paymentMethod || t("checkout.notChosen")}</p>

        <div className="checkout-total">
          <strong>{t("checkout.sumSummary")}</strong> {sum.toFixed(2)} €  
        </div>

        <button
          disabled={
            !deliveryMethod ||
            !paymentMethod ||
            (deliveryMethod === t("checkout.checkoutMethodThird") && !storeLocation) ||
            !firstName ||
            !lastName ||
            !email ||
            !postalCode ||
            !adress
          }
          className="checkout-button"
          onClick={submitOrder}
        >
          {t("checkout.continue")}
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
            <h2 style={{ marginBottom: 12 }}>{t("checkout.succes")}</h2>
            <p style={{ opacity: 0.85, marginBottom: 24 }}>
              {t("checkout.thanks")}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                className="btn btn--primary"
                onClick={() => navigate("/")}
              >
                {t("checkout.home")}
              </button>

              <button
                className="btn btn--ghost"
                onClick={() => setSuccess(false)}
              >
                {t("checkout.close")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
