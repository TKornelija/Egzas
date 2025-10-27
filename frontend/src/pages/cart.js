import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { getItems, setQty, removeItem, total, clearCart } from "../lib/cart";

export default function Cart() {
  const { t } = useI18n();
  const [items, setItems] = useState(getItems());

  useEffect(() => {
    // jei krepšelis tuščias – galima parodyti žinutę
  }, []);

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
    <div className="container" style={{ padding: "48px 0" }}>
      <h1 style={{ marginBottom: 8 }}>{t("nav.cart")}</h1>
      {items.length === 0 ? (
        <div style={{ opacity:.85 }}>
          Your cart is empty. <Link to="/costumes" className="footer__link">Browse costumes</Link>
        </div>
      ) : (
        <>
          <div style={{ display:"grid", gap:12, marginTop:16 }}>
            {items.map((it) => (
              <div key={`${it.id}-${it.size}`} style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:12, alignItems:"center", background:"#131313", border:"1px solid #1f1f1f", borderRadius:12, padding:12 }}>
                <div>
                  <div style={{ fontWeight:700 }}>{it.title || it.name || it.id}</div>
                  <div style={{ fontSize:13, opacity:.8 }}>Size: {it.size || "-"}</div>
                </div>
                <div style={{ opacity:.85 }}>{(it.price ?? 0).toFixed(2)} €</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={e=>handleQty(it.id, it.size, Math.max(1, Number(e.target.value)||1))}
                    style={{ width:72, background:"#181818", color:"#fff", border:"1px solid #333", borderRadius:8, padding:"6px 10px" }}
                  />
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn btn--ghost" onClick={()=>handleRemove(it.id, it.size)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <div style={{ marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button className="btn btn--ghost" onClick={()=>{ clearCart(); setItems([]); }}>
              Clear cart
            </button>
            <div style={{ fontSize:18, fontWeight:800 }}>
              Total: {sum.toFixed(2)} €
            </div>
          </div>

          <div style={{ marginTop:12 }}>
            <button className="btn btn--primary" onClick={()=>alert("Checkout coming soon ✨")}>
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
