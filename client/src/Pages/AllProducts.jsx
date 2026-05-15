import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { API_BASE_URL } from "../api";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  // Fetch all products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        if (products.length === 0) setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data);

        // Dynamically build categories from product data
        const cats = [
          "All",
          ...new Set(data.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter + Sort whenever dependencies change
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    if (activeFilter !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === activeFilter.toLowerCase(),
      );
    }

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name_asc")
      result.sort((a, b) => a.name?.localeCompare(b.name));

    setFiltered(result);
  }, [products, activeFilter, sort, search]);

  function handleAddToCart(product) {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAddedIds((prev) => new Set([...prev, product._id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(product._id);
        return updated;
      });
    }, 1500);
  }

  return (
    <>
      <Navbar />
      {/* Page Header */}
      <div style={{ paddingTop: "var(--nav-h)" }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%)",
            color: "var(--white)",
            textAlign: "center",
            padding: "5rem 2.5rem 4rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            className="section-label"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Our Collection
          </span>
          <h1
            className="section-title"
            style={{ color: "var(--white)", marginTop: "0.5rem" }}
          >
            All <em>Products</em>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              marginTop: "1rem",
              fontSize: "1rem",
              fontWeight: 300,
            }}
          >
            {filtered.length} arrangement{filtered.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>

        <div className="section">
          {/* Search + Sort bar */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "2rem",
              justifyContent: "space-between",
            }}
          >
            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: "1",
                minWidth: "220px",
                maxWidth: "380px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.4,
                  fontSize: "1rem",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search arrangements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "1.5px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.7rem 1rem 0.7rem 2.5rem",
                  fontFamily: "var(--ff-sans)",
                  fontSize: "0.9rem",
                  background: "var(--white)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: "1.5px solid var(--border)",
                borderRadius: "8px",
                padding: "0.7rem 1rem",
                fontFamily: "var(--ff-sans)",
                fontSize: "0.85rem",
                background: "var(--white)",
                color: "var(--text)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "0.5rem 1.4rem",
                  borderRadius: "100px",
                  border: "1.5px solid",
                  borderColor:
                    activeFilter === cat ? "var(--brown)" : "var(--border)",
                  background:
                    activeFilter === cat ? "var(--brown)" : "transparent",
                  color:
                    activeFilter === cat ? "var(--white)" : "var(--text-muted)",
                  fontFamily: "var(--ff-sans)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "6rem 0",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</div>
              <p style={{ fontFamily: "var(--ff-serif)", fontSize: "1.4rem" }}>
                Loading arrangements...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "6rem 0",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🥀</div>
              <p
                style={{
                  fontFamily: "var(--ff-serif)",
                  fontSize: "1.6rem",
                  color: "var(--brown)",
                }}
              >
                No arrangements found
              </p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Try a different filter or search term
              </p>
              <button
                className="btn btn-dark"
                style={{ marginTop: "2rem" }}
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filtered.length > 0 && (
            <div className="products-grid">
              {filtered.map((product) => (
                <div className="product-card" key={product._id}>
                  <div
                    className="product-img-wrap"
                    onClick={() =>
                      navigate(`/product/${product.slug || product._id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        product.image || product.imageUrl || "/placeholder.jpg"
                      }
                      alt={product.name}
                    />

                    {/* Hover Actions */}
                    <div className="product-actions">
                      <button
                        className="product-wish"
                        aria-label="Wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            category: product.category,
                          });
                        }}
                      >
                        {isWished(product._id) ? "♥" : "♡"}
                      </button>
                      <button
                        className="product-quick"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        {addedIds.has(product._id) ? "✓ Added" : "Quick Add"}
                      </button>
                    </div>

                    {/* Badges */}
                    {product.badge && (
                      <span
                        className={`product-badge ${
                          product.badge === "New"
                            ? "product-badge--new"
                            : product.badge === "Sale"
                              ? "product-badge--sale"
                              : product.badge === "Bestseller"
                                ? "product-badge--bestseller"
                                : ""
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    {!product.badge &&
                      product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="product-badge product-badge--sale">
                          Sale
                        </span>
                      )}
                  </div>

                  <div className="product-info">
                    <p className="product-cat">{product.category}</p>
                    <h3
                      className="product-name"
                      onClick={() =>
                        navigate(`/product/${product.slug || product._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>
                    <div className="product-bottom">
                      <p className="product-price">
                        ₹{product.price?.toLocaleString()}
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <s>₹{product.originalPrice?.toLocaleString()}</s>
                          )}
                      </p>
                      <button
                        className="btn-add"
                        onClick={() => handleAddToCart(product)}
                      >
                        {addedIds.has(product._id) ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
