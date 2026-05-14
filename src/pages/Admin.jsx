import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

// ── Set your admin email here ──────────────────────────────
const ADMIN_EMAIL = "jaivardhan@commontime.in";
// ──────────────────────────────────────────────────────────

const CATEGORIES = ["coffee", "merchandise"];

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyForm = {
  name: "", description: "", price: "", category: "merchandise",
  stock_quantity: "", image_url: "", slug: "", is_active: true, tag: "",
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [toast, setToast] = useState(null);

  // ── Auth guard ───────────────────────────────────────────
  useEffect(() => {
    if (user === null) { navigate("/login"); return; }
    if (user && user.email !== ADMIN_EMAIL) { navigate("/"); return; }
  }, [user]);

  // ── Fetch products ───────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Toast helper ─────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Image handling ───────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imgFile) return form.image_url;
    const ext = imgFile.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, imgFile, { upsert: true });
    if (error) { showToast("Image upload failed: " + error.message, "error"); return form.image_url; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Open add modal ───────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setImgFile(null);
    setImgPreview("");
    setEditId(null);
    setModal("add");
  };

  // ── Open edit modal ──────────────────────────────────────
  const openEdit = (p) => {
    setForm({
      name: p.name || "", description: p.description || "",
      price: p.price ? (p.price / 100).toString() : "",
      category: p.category || "merchandise",
      stock_quantity: p.stock_quantity?.toString() || "",
      image_url: p.image_url || "", slug: p.slug || "",
      is_active: p.is_active ?? true, tag: p.tag || "",
    });
    setImgFile(null);
    setImgPreview(p.image_url || "");
    setEditId(p.id);
    setModal("edit");
  };

  // ── Form field change ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "name") next.slug = slugify(value);
      return next;
    });
  };

  // ── Save (add or edit) ───────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const imageUrl = await uploadImage();
    const payload = {
      name: form.name,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      category: form.category,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      image_url: imageUrl,
      slug: form.slug || slugify(form.name),
      is_active: form.is_active,
      tag: form.tag || null,
    };

    let error;
    if (modal === "add") {
      ({ error } = await supabase.from("products").insert([payload]));
    } else {
      ({ error } = await supabase.from("products").update(payload).eq("id", editId));
    }

    setSaving(false);
    if (error) { showToast(error.message, "error"); return; }
    showToast(modal === "add" ? "product added!" : "product updated!");
    setModal(null);
    fetchProducts();
  };

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("delete this product?")) return;
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDeleting(null);
    if (error) { showToast(error.message, "error"); return; }
    showToast("product deleted");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Toggle active ────────────────────────────────────────
  const toggleActive = async (p) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
  };

  // ── Filtered list ────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  if (user === undefined) return null; // still loading auth

  return (
    <div className="min-h-screen bg-[#fafaf8] font-[Garet_Book]">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-5 py-3 text-[11px] tracking-widest shadow-lg ${toast.type === "error" ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white border-b border-black/5 px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 z-50">
        <div>
          <p className="text-[9px] tracking-[0.35em] text-black/30 mb-0.5">common time</p>
          <h1 className="text-sm font-[Bai_Jamjuree] font-light tracking-tight text-black">admin panel</h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#1a1a1a] text-white text-[9px] tracking-[0.3em] px-5 py-2.5 hover:bg-[#8b7355] transition-colors duration-300"
        >
          + add product
        </button>
      </div>

      <div className="px-6 md:px-12 py-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "total products", val: products.length },
            { label: "active", val: products.filter((p) => p.is_active).length },
            { label: "hidden", val: products.filter((p) => !p.is_active).length },
            { label: "categories", val: [...new Set(products.map((p) => p.category))].length },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-black/5 p-5">
              <p className="text-[8px] tracking-[0.3em] text-black/30 mb-2">{s.label}</p>
              <p className="text-2xl font-[Bai_Jamjuree] font-light text-black">{s.val}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="mb-5">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="search products..."
            className="w-full md:w-80 bg-white border border-black/10 px-4 py-2.5 text-[12px] text-black outline-none focus:border-black/30 transition-colors"
          />
        </div>

        {/* ── Product table ── */}
        {loading ? (
          <div className="text-[11px] tracking-widest text-black/30 py-20 text-center">loading...</div>
        ) : (
          <div className="bg-white border border-black/5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5">
                  {["image", "name", "category", "price", "stock", "status", "actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[8px] tracking-[0.3em] text-black/30 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-black/[0.04] hover:bg-black/[0.01] transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 bg-[#f5f5f3] overflow-hidden">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-[#ebe9e4]" />}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[12px] text-black font-[Bai_Jamjuree]">{p.name}</p>
                      {p.slug && <p className="text-[9px] text-black/25 mt-0.5">/{p.slug}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[9px] tracking-[0.2em] text-[#8b7355]">{p.category}</span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-black/70">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3 text-[12px] text-black/70">{p.stock_quantity}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`text-[8px] tracking-[0.2em] px-2.5 py-1 transition-colors ${p.is_active ? "bg-emerald-50 text-emerald-600" : "bg-black/5 text-black/30"}`}
                      >
                        {p.is_active ? "active" : "hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} className="text-[9px] tracking-[0.2em] text-black/40 hover:text-black transition-colors">edit</button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-[9px] tracking-[0.2em] text-red-300 hover:text-red-500 transition-colors"
                        >
                          {deleting === p.id ? "..." : "delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-[11px] tracking-widest text-black/20">no products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-sm font-[Bai_Jamjuree] font-light tracking-tight">{modal === "add" ? "add product" : "edit product"}</h2>
              <button onClick={() => setModal(null)} className="text-black/30 hover:text-black text-lg transition-colors">×</button>
            </div>

            <form onSubmit={handleSave} className="px-8 py-6 space-y-5">

              {/* Image upload */}
              <div>
                <label className="block text-[8px] tracking-[0.3em] text-black/40 mb-2">product image</label>
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-[#f5f5f3] overflow-hidden flex-shrink-0">
                    {imgPreview
                      ? <img src={imgPreview} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-[#ebe9e4]" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="file" accept="image/*" onChange={handleImageChange}
                      className="w-full text-[11px] text-black/50 file:mr-3 file:text-[9px] file:tracking-widest file:bg-black file:text-white file:border-0 file:px-3 file:py-1.5 file:cursor-pointer" />
                    <p className="text-[9px] text-black/30">or paste a url below</p>
                    <input name="image_url" value={form.image_url} onChange={handleChange}
                      placeholder="https://..."
                      className="w-full border border-black/10 px-3 py-2 text-[11px] outline-none focus:border-black/30" />
                  </div>
                </div>
              </div>

              {/* Name */}
              <Field label="product name *" name="name" value={form.name} onChange={handleChange} required />

              {/* Slug */}
              <Field label="slug (url)" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />

              {/* Description */}
              <div>
                <label className="block text-[8px] tracking-[0.3em] text-black/40 mb-2">description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full border border-black/10 px-3 py-2 text-[11px] outline-none focus:border-black/30 resize-none" />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="price (₹) *" name="price" value={form.price} onChange={handleChange} type="number" step="0.01" required />
                <Field label="stock quantity" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} type="number" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[8px] tracking-[0.3em] text-black/40 mb-2">category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-black/10 px-3 py-2 text-[11px] outline-none focus:border-black/30 bg-white">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Tag */}
              <Field label="tag (e.g. new, bestseller)" name="tag" value={form.tag} onChange={handleChange} />

              {/* Active */}
              <div className="flex items-center gap-3">
                <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange}
                  className="w-3.5 h-3.5 accent-[#8b7355]" />
                <label htmlFor="is_active" className="text-[9px] tracking-[0.3em] text-black/50">visible on site</label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-2 border-t border-black/5">
                <button type="button" onClick={() => setModal(null)} className="text-[9px] tracking-[0.3em] text-black/40 hover:text-black transition-colors">cancel</button>
                <button type="submit" disabled={saving}
                  className="bg-[#1a1a1a] text-white text-[9px] tracking-[0.3em] px-6 py-2.5 hover:bg-[#8b7355] transition-colors disabled:opacity-40">
                  {saving ? "saving..." : modal === "add" ? "add product" : "save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable field ───────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", required, placeholder, step }) {
  return (
    <div>
      <label className="block text-[8px] tracking-[0.3em] text-black/40 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        placeholder={placeholder} step={step}
        className="w-full border border-black/10 px-3 py-2 text-[11px] outline-none focus:border-black/30 transition-colors" />
    </div>
  );
}
