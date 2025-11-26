import { useState } from "react";
import { apiPost } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function CostumesAdd() {
  const navigate = useNavigate();

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
    <div style={{ maxWidth: 600 }}>
      <h2>Pridėti naują kostiumą</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "lightgreen" }}>{success}</p>}

      <form onSubmit={handleSubmit} className="form-admin">

        <label>Pavadinimas</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Aprašymas</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Pirkimo kaina (€)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required />

        <label>Nuomos kaina (€ / dienai)</label>
        <input type="number" name="rentalPrice" value={form.rentalPrice} onChange={handleChange} required />

        <label>Kiekis sandėlyje</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />

        <label>Kategorija</label>
        <input name="category" value={form.category} onChange={handleChange} />

        <label>Dydžiai (pvz: S,M,L)</label>
        <input name="size" value={form.size} onChange={handleChange} />

        <label>Nuotraukų URL (per kablelį)</label>
        <input name="imageUrls" value={form.imageUrls} onChange={handleChange} />

        <button className="btn btn--primary" type="submit" style={{ marginTop: 20 }}>
          Pridėti kostiumą
        </button>
      </form>
    </div>
  );
}
