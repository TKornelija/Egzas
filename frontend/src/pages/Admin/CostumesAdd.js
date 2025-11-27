import { useState } from "react";
import { apiPost } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import "../../styles/AdminCostumes.css";

export default function CostumesAdd() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rentalPrice: "",
    quantity: 1,
    category: "",
    size: "",
    imageUrls: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description)
      return setError("Užpildykite visus laukus!");

    try {
      await apiPost("/api/costumes", {
        ...form,
        price: Number(form.price),
        rentalPrice: Number(form.rentalPrice),
        quantity: Number(form.quantity),
        size: form.size.split(",").map((s) => s.trim()),
        imageUrls: form.imageUrls.split(",").map((u) => u.trim()),
      });

      setSuccess("Kostiumas sėkmingai sukurtas!");
      setTimeout(() => navigate("/admin/costumes"), 1500);
    } catch (e) {
      setError("Nepavyko sukurti kostiumo.");
    }
  }

  return (
    <div>
      <h2>{t("costumesAdd.tittle")}</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit} className="form-admin">

        <label>{t("costumesAdd.name")}</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>{t("costumesAdd.text")}</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>{t("costumesAdd.price")}</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required />

        <label>{t("costumesAdd.rent")}</label>
        <input type="number" name="rentalPrice" value={form.rentalPrice} onChange={handleChange} required />

        <label>{t("costumesAdd.quantity")}</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />

        <label>{t("costumesAdd.category")}</label>
        <input name="category" value={form.category} onChange={handleChange} />

        <label>{t("costumesAdd.sizes")}</label>
        <input name="size" value={form.size} onChange={handleChange} />

        <label>{t("costumesAdd.images")}</label>
        <input name="imageUrls" value={form.imageUrls} onChange={handleChange} />
        
        <div class="mygtukas">
        <button className="btn btn--primary" type="submit" >
          {t("costumesAdd.add")}
        
        </button>
        </div>
      </form>
    </div>
  );
}
