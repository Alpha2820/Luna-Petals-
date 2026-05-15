import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  function handleAddToCart(product) {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    navigate("/checkout");
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "var(--nav-h)",
          minHeight: "100vh",
          background: "var(--cream)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%)",
            padding: "3.5rem 2.5rem 3rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Back to home */}
          <Link
            to="/"
            style={{
              position: "absolute",
              left: "2.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              color: "rgba(255,255,255,0.75)",
              fontSize: ".78rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontFamily: "var(--ff-sans)",
              transition: "color .2s",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>

          <span
            className="section-label"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            My Collection
          </span>
          <h1
            className="section-title"
            style={{ color: "var(--white)", marginTop: ".4rem" }}
          >
            My <em>Wishlist</em>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: ".85rem",
              marginTop: ".5rem",
              fontWeight: 300,
            }}
          >
            {wishlist.length} {wishlist.length === 1 ? "bouquet" : "bouquets"}{" "}
            saved
          </p>
        </div>

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "3rem 2.5rem",
          }}
        >
          {/* Empty State */}
          {wishlist.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "6rem 2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div style={{ fontSize: "3.5rem" }}>🌸</div>
              <h2
                style={{
                  fontFamily: "var(--ff-serif)",
                  fontSize: "2rem",
                  fontWeight: 400,
                  color: "var(--brown)",
                }}
              >
                Your wishlist is empty
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: ".95rem",
                  maxWidth: "340px",
                  lineHeight: 1.7,
                }}
              >
                Heart a bouquet while browsing and it'll appear here for you.
              </p>
              <Link
                to="/products"
                className="btn btn-dark"
                style={{ marginTop: ".5rem" }}
              >
                Browse Bouquets
              </Link>
            </div>
          )}

          {/* Wishlist Grid */}
          {wishlist.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  style={{
                    background: "var(--white)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    transition: "box-shadow .3s, transform .3s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/product/${product.slug || product._id}`)
                    }
                  >
                    <img
                      src={
                        product.image || product.imageUrl || "/placeholder.jpg"
                      }
                      alt={product.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        transition: "transform .5s var(--ease)",
                      }}
                    />

                    {/* Remove heart button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product._id);
                      }}
                      title="Remove from wishlist"
                      style={{
                        position: "absolute",
                        top: ".6rem",
                        right: ".6rem",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(4px)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: ".95rem",
                        boxShadow: "var(--shadow-sm)",
                        transition: "transform .2s",
                        zIndex: 2,
                      }}
                    >
                      ♥
                    </button>

                    {/* Badge */}
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
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      padding: ".85rem 1rem 1rem",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: ".6rem",
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {product.category}
                    </p>
                    <h3
                      onClick={() =>
                        navigate(`/product/${product.slug || product._id}`)
                      }
                      style={{
                        fontFamily: "var(--ff-serif)",
                        fontSize: "1rem",
                        fontWeight: 400,
                        color: "var(--brown)",
                        cursor: "pointer",
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: ".85rem",
                        fontWeight: 500,
                        color: "var(--brown)",
                      }}
                    >
                      ₹{product.price?.toLocaleString()}
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <s
                            style={{
                              color: "var(--text-muted)",
                              fontWeight: 300,
                              fontSize: ".75rem",
                              marginLeft: ".3rem",
                            }}
                          >
                            ₹{product.originalPrice?.toLocaleString()}
                          </s>
                        )}
                    </p>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        marginTop: "auto",
                        paddingTop: ".5rem",
                      }}
                    >
                      <button
                        className="btn-add"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: ".5rem .5rem",
                        }}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        title="Remove"
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "6px",
                          border: "1.5px solid var(--border)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: ".85rem",
                          color: "var(--text-muted)",
                          transition: "all .2s",
                          flexShrink: 0,
                        }}
                      >
                        🗑
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
