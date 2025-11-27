import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../../lib/api";
import { useI18n } from "../../lib/i18n";
import "../../styles/AdminCostumes.css";



export default function AdminCostumeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

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

  
  if (loading) return <p>{t("costumesEdit.loading")}</p>;

  return (
    <div>
      <h2>{t("costumesEdit.edit")} #{id}</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form  onSubmit={handleSubmit} className="form-admin">

        <label>{t("costumesEdit.name")}</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>{t("costumesEdit.text")}</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>{t("costumesEdit.price")} (€)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required />

        <label>{t("costumesEdit.rent")}</label>
        <input type="number" name="rentalPrice" value={form.rentalPrice} onChange={handleChange} required />

        <label>{t("costumesEdit.quantity")}</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />

        <label>{t("costumesEdit.category")}</label>
        <input name="category" value={form.category} onChange={handleChange} />

        <label>{t("costumesEdit.size")}</label>
        <input name="size" value={form.size} onChange={handleChange} />

        <label>{t("costumesEdit.image")}</label>
        <input name="imageUrls" value={form.imageUrls} onChange={handleChange} />
        
        <div class="mygtukas">
        <button className="btn btn--primary" type="submit">
          {t("costumesEdit.save")}
        </button>
        </div>
      </form>
    </div>
  );
}
