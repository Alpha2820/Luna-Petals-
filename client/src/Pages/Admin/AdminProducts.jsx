import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

const EMPTY = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  image: "",
  badge: "",
  desc: "",
  perks: "",
  stems: "",
  stars: "5.0",
  reviews: "0",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.desc) {
      alert("Please fill in all required fields");
      return;
    }
    if (!editId && !imageFile) {
      alert("Please upload a product image");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.image;

      // Upload image if new file selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.message || "Image upload failed");
        imageUrl = uploadData.url;
      }

      const body = {
        ...form,
        image: imageUrl,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stars: Number(form.stars),
        reviews: Number(form.reviews),
        perks: form.perks
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        stems: form.stems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const url = editId
        ? `${API_BASE_URL}/api/products/${editId}`
        : `${API_BASE_URL}/api/products`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save product");

      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || "",
      image: product.image,
      badge: product.badge || "",
      desc: product.desc,
      perks: product.perks.join(", "),
      stems: product.stems.join(", "),
      stars: product.stars,
      reviews: product.reviews,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    border: "1.5px solid var(--border)",
    borderRadius: "8px",
    padding: ".7rem 1rem",
    fontFamily: "var(--ff-sans)",
    fontSize: ".9rem",
    color: "var(--text)",
    background: "var(--off-white)",
    outline: "none",
    width: "100%",
  };

  const labelStyle = {
    fontSize: ".75rem",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: ".4rem",
    display: "block",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "var(--brown)",
          color: "var(--blush)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        <span
          style={{
            fontFamily: "var(--ff-serif)",
            fontSize: "1.6rem",
            fontStyle: "italic",
            color: "var(--white)",
            marginBottom: ".25rem",
          }}
        >
          Luna Petals
        </span>
        <span
          style={{
            fontSize: ".65rem",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: "3rem",
          }}
        >
          Admin Panel
        </span>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            flex: 1,
          }}
        >
          {[
            { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
            { label: "Orders", icon: "📦", path: "/admin/orders" },
            { label: "Products", icon: "🌸", path: "/admin/products" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".75rem",
                padding: ".85rem 1rem",
                borderRadius: "10px",
                color: "var(--blush)",
                fontSize: ".9rem",
                background:
                  item.path === "/admin/products"
                    ? "rgba(255,255,255,.1)"
                    : "transparent",
                transition: "background .2s",
                textDecoration: "none",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin");
          }}
          style={{
            background: "rgba(255,255,255,.1)",
            border: "none",
            color: "var(--blush)",
            padding: ".85rem 1rem",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: ".9rem",
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            fontFamily: "var(--ff-sans)",
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "3rem" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: ".7rem",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--rose)",
                fontWeight: 500,
              }}
            >
              Manage
            </span>
            <h1
              style={{
                fontFamily: "var(--ff-serif)",
                fontSize: "2.5rem",
                fontWeight: 400,
                color: "var(--brown)",
                marginTop: ".25rem",
              }}
            >
              Products
            </h1>
          </div>
          <button
            className="btn btn-dark"
            onClick={() => {
              setShowForm(!showForm);
              setForm(EMPTY);
              setEditId(null);
              setImageFile(null);
              setImagePreview(null);
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div
            style={{
              background: "var(--white)",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--ff-serif)",
                fontSize: "1.6rem",
                color: "var(--brown)",
                marginBottom: "1.5rem",
                fontWeight: 400,
              }}
            >
              {editId ? "Edit Product" : "Add New Product"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ethereal Romance"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Signature Collection"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2499"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Old Price (₹)</label>
                <input
                  name="oldPrice"
                  type="number"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="3000 (optional)"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / 3" }}>
                <label style={labelStyle}>Product Image *</label>
                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        ...inputStyle,
                        padding: ".5rem",
                        cursor: "pointer",
                      }}
                    />
                    <span
                      style={{
                        fontSize: ".7rem",
                        color: "var(--text-muted)",
                        marginTop: ".3rem",
                        display: "block",
                      }}
                    >
                      Recommended: 500x500px or larger
                    </span>
                  </div>
                  {imagePreview ? (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "2px solid var(--border)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : form.image && editId ? (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "2px solid var(--border)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={form.image}
                        alt="current"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Badge</label>
                <input
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  placeholder="Bestseller / New / Sale"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Stars</label>
                <input
                  name="stars"
                  type="number"
                  step="0.1"
                  value={form.stars}
                  onChange={handleChange}
                  placeholder="4.8"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / 3" }}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="A breathtaking symphony of..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <div style={{ gridColumn: "1 / 3" }}>
                <label style={labelStyle}>Perks (comma separated)</label>
                <input
                  name="perks"
                  value={form.perks}
                  onChange={handleChange}
                  placeholder="Hand-Tied Perfection, Sustainably Sourced, White Glove Delivery"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / 3" }}>
                <label style={labelStyle}>Stems (comma separated)</label>
                <input
                  name="stems"
                  value={form.stems}
                  onChange={handleChange}
                  placeholder="Premium Blush Roses, White Peonies, Eucalyptus"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                className="btn btn-dark"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Product"
                    : "Save Product"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY);
                  setEditId(null);
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS LIST */}
        {loading ? (
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "4rem",
            }}
          >
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              borderRadius: "16px",
              padding: "4rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</p>
            <p style={{ color: "var(--text-muted)" }}>
              No products yet — add your first one!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  padding: "1.5rem 2rem",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* INFO */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".75rem",
                      marginBottom: ".3rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--ff-serif)",
                        fontSize: "1.2rem",
                        color: "var(--brown)",
                      }}
                    >
                      {product.name}
                    </span>
                    {product.badge && (
                      <span
                        style={{
                          fontSize: ".6rem",
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                          background: "var(--blush)",
                          color: "var(--rose-dark)",
                          padding: ".2rem .7rem",
                          borderRadius: "100px",
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ fontSize: ".8rem", color: "var(--text-muted)" }}
                  >
                    {product.category} • ⭐ {product.stars} ({product.reviews}{" "}
                    reviews)
                  </div>
                </div>

                {/* PRICE */}
                <div
                  style={{
                    fontFamily: "var(--ff-serif)",
                    fontSize: "1.4rem",
                    color: "var(--brown)",
                    minWidth: "100px",
                    textAlign: "right",
                  }}
                >
                  ₹{product.price.toLocaleString()}
                  {product.oldPrice && (
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "var(--text-muted)",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{product.oldPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div style={{ display: "flex", gap: ".75rem" }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: ".5rem 1.25rem", fontSize: ".75rem" }}
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-dark"
                    style={{
                      padding: ".5rem 1.25rem",
                      fontSize: ".75rem",
                      background: "var(--rose-dark)",
                    }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
