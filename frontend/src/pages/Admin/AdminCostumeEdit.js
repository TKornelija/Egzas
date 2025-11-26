import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../../lib/api";

export default function AdminCostumeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rentalPrice: "",
    quantity: "",
    category: "",
    size: "",
    imageUrls: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet(`/api/costumes/${id}`);

        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          rentalPrice: data.rentalPrice,
          quantity: data.quantity,
          category: data.category || "",
          size: (data.size || []).join(", "),
          imageUrls: (data.imageUrls || []).join(", "),
        });
      } catch (e) {
        setError("Nepavyko gauti kostiumo duomenų.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiPut(`/api/costumes/${id}`, {
        ...form,
        price: Number(form.price),
        rentalPrice: Number(form.rentalPrice),
        quantity: Number(form.quantity),
        size: form.size.split(",").map((s) => s.trim()),
        imageUrls: form.imageUrls.split(",").map((u) => u.trim()),
      });

      setSuccess("Kostiumas sėkmingai atnaujintas!");
      setTimeout(() => navigate("/admin/costumes"), 1500);
    } catch (e) {
      setError("Nepavyko atnaujinti kostiumo.");
    }
  }

  
  if (loading) return <p>Kraunama</p>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Redaguoti kostiumą #{id}</h2>

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

        <label>Dydžiai (pvz: S, M, L)</label>
        <input name="size" value={form.size} onChange={handleChange} />

        <label>Nuotraukų URL</label>
        <input name="imageUrls" value={form.imageUrls} onChange={handleChange} />

        <button className="btn btn--primary" type="submit" style={{ marginTop: 20 }}>
          Išsaugoti
        </button>
      </form>
    </div>
  );
}
