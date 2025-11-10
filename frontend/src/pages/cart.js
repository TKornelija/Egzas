import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { getItems, setQty, removeItem, total, clearCart } from "../lib/cart";
import "../styles/cart.css";

export default function Cart() {
  const { t } = useI18n();
  const [items, setItems] = useState(getItems());
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleQty = (id, size, q) => {
    const list = setQty(id, size, q);
    setItems(list);
  };

  const handleRemove = (id, size) => {
    removeItem(id, size);
    setItems(getItems());
  };

  const sum = total(items);

  return (
    <div className="container cart-container">
      <h1 className="cart-title">{t("nav.cart")}</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          {t("cart.empty") || "Your cart is empty."}{" "}
          <Link to="/costumes" className="footer__link">
            {t("cart.browse") || "Browse costumes"}
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((it) => (
              <div key={`${it.id}-${it.size}`} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={it.imageUrl || it.image || "/images/no-image.png"}
                    alt={it.name || "Costume"}
                  />
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-name">
                    {it.title || it.name || it.id}
                  </div>
                  <div className="cart-item-size">
                    {t("details.size") || "Size"}: {it.size || "-"}
                  </div>
                </div>

                <div className="cart-item-price">
                  {(it.price ?? 0).toFixed(2)} €
                </div>

                <div className="cart-item-qty">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) =>
                      handleQty(
                        it.id,
                        it.size,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                  />
                </div>

                <div className="cart-item-actions">
                  <button
                    className="btn btn--ghost"
                    onClick={() => handleRemove(it.id, it.size)}
                  >
                    {t("cart.remove") || "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <button
              className="btn btn--ghost"
              onClick={() => {
                clearCart();
                setItems([]);
              }}
            >
              {t("cart.clear") || "Clear cart"}
            </button>
            <div className="cart-total">
              {t("cart.total") || "Total"}:{" "}
              <strong>{sum.toFixed(2)} €</strong>
            </div>
          </div>

          <div className="cart-checkout">
            <button
              className="btn btn--primary"
              onClick={() => navigate("/checkout")}
            >
              {t("cart.checkout") || "Proceed to checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
