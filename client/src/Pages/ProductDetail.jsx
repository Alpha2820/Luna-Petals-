import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ethereal from "../assets/product_ethereal.png";
import lavender from "../assets/product_lavender_dream.png";
import proposal from "../assets/bouquet_proposal.png";
import surprise from "../assets/bouquet_surprise.png";
import wedding from "../assets/bouquet_wedding.png";
import birthday from "../assets/bouquet_birthday.png";
import anniversary from "../assets/bouquet_anniversary.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const FALLBACK_PRODUCTS = {
  "ethereal-romance": {
    name: "Ethereal Romance",
    category: "Signature Collection",
    price: "₹2,499",
    oldPrice: null,
    stars: "4.8",
    reviews: 124,
    img: ethereal,
    desc: "A breathtaking symphony of soft blush roses, pristine white peonies, and delicate greenery. Meticulously curated by our master florists, capturing the essence of pure, sophisticated devotion.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Sustainably Sourced",
      "✦ White Glove Delivery",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Premium Blush Ocean Song Roses",
      "White Duchess Peonies",
      "Dusty Miller & Silver Dollar Eucalyptus",
      "Seasonal Greenery",
    ],
  },
  "lavender-dream": {
    name: "Lavender Dream",
    category: "New Arrival",
    price: "₹1,999",
    oldPrice: null,
    stars: "4.7",
    reviews: 86,
    img: lavender,
    desc: "A dreamy cascade of lavender blooms and soft purple tones. Perfect for those who appreciate the gentle, calming beauty of nature crafted into an elegant bouquet.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Sustainably Sourced",
      "✦ Same Day Delivery",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Fresh Lavender Stems",
      "Purple Lisianthus",
      "Lilac Spray Roses",
      "Silver Brunia Berries",
    ],
  },
  "red-desire": {
    name: "Red Desire",
    category: "Classic Collection",
    price: "₹3,199",
    oldPrice: null,
    stars: "4.9",
    reviews: 210,
    img: proposal,
    desc: "A bold and passionate arrangement of deep crimson roses. The timeless symbol of love and desire, crafted for moments that demand an unforgettable grand gesture.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Premium Red Roses",
      "✦ White Glove Delivery",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Premium Red Freedom Roses",
      "Deep Red Ranunculus",
      "Black Baccara Accent Roses",
      "Dark Italian Ruscus",
    ],
  },
  "sunny-surprise": {
    name: "Sunny Surprise",
    category: "Sale Collection",
    price: "₹1,699",
    oldPrice: "₹2,100",
    stars: "4.6",
    reviews: 58,
    img: surprise,
    desc: "A joyful explosion of golden sunflowers and bright seasonal blooms. The perfect surprise to brighten anyone's day instantly.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Sustainably Sourced",
      "✦ Same Day Delivery",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Large Head Sunflowers",
      "Yellow Spray Roses",
      "Orange Gerbera Daisies",
      "Fresh Seasonal Greenery",
    ],
  },
  "bridal-elegance": {
    name: "Bridal Elegance",
    category: "Wedding Collection",
    price: "₹8,999",
    oldPrice: null,
    stars: "5.0",
    reviews: 312,
    img: wedding,
    desc: "The ultimate bridal bouquet — a masterpiece of pristine white roses, cascading peonies and soft ivory blooms. Designed to be the most beautiful thing in the room on your most beautiful day.",
    perks: [
      "✦ Bridal Specialist",
      "✦ Custom Design",
      "✦ White Glove Delivery",
      "✦ Freshness Guaranteed",
    ],
    stems: [
      "White Avalanche Roses",
      "Ivory Duchess Peonies",
      "White Ranunculus",
      "Cascading Jasmine Vines",
    ],
  },
  "birthday-bloom": {
    name: "Birthday Bloom",
    category: "Birthday Collection",
    price: "₹1,899",
    oldPrice: null,
    stars: "4.8",
    reviews: 178,
    img: birthday,
    desc: "A vibrant and joyful burst of colour perfect for birthdays. Bright, bold and beautiful — this bouquet says celebration from the moment it's seen.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Same Day Delivery",
      "✦ Custom Message Card",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Hot Pink Roses",
      "Orange Gerbera Daisies",
      "Yellow Freesias",
      "Colourful Seasonal Blooms",
    ],
  },
  "modern-romance": {
    name: "Modern Romance",
    category: "Anniversary Collection",
    price: "₹3,999",
    oldPrice: null,
    stars: "4.9",
    reviews: 143,
    img: anniversary,
    desc: "A sophisticated and contemporary arrangement that speaks the language of modern love. Deep tones, structured stems and an elegance that lasts as long as your love story.",
    perks: [
      "✦ Hand-Tied Perfection",
      "✦ Sustainably Sourced",
      "✦ White Glove Delivery",
      "✦ 7-Day Freshness Guarantee",
    ],
    stems: [
      "Deep Burgundy Roses",
      "Chocolate Cosmos",
      "Dark Calla Lilies",
      "Eucalyptus & Ferns",
    ],
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await res.json();

        // Format API data to match expected structure
        const formattedProduct = {
          ...data,
          img: data.image,
          price: `₹${data.price?.toLocaleString?.() || data.price}`,
          oldPrice: data.oldPrice
            ? `₹${data.oldPrice?.toLocaleString?.() || data.oldPrice}`
            : null,
          stars: data.stars || 4.9,
          reviews: data.reviews || 0,
          perks: data.perks || [
            "✦ Hand-Tied Perfection",
            "✦ Sustainably Sourced",
            "✦ Same Day Delivery",
            "✦ 7-Day Freshness Guarantee",
          ],
          stems: data.stems || ["Fresh Blooms", "Premium Greenery"],
          desc:
            data.desc ||
            "A beautiful floral arrangement carefully crafted by our expert florists.",
        };
        setProduct(formattedProduct);

        // Check if product is in wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWished(wishlist.some((item) => item._id === id));
      } catch (err) {
        console.error("Failed to fetch product:", err);
        // Use fallback
        const fallback = FALLBACK_PRODUCTS["ethereal-romance"];
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: id,
      name: product.name,
      price: parseInt(product.price?.replace(/[₹,]/g, "") || 0),
      image: product.img,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setTimeout(() => navigate("/checkout"), 800);
  };

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some((item) => item._id === id);

    if (exists) {
      const updated = wishlist.filter((item) => item._id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      const priceNum = parseInt(product.price?.replace(/[₹,]/g, "") || 0);
      wishlist.push({
        _id: id,
        name: product.name,
        price: priceNum,
        image: product.img,
        slug: id,
        category: product.category,
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    setWished(!wished);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "var(--nav-h)",
            textAlign: "center",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</div>
          <p style={{ fontFamily: "var(--ff-serif)", fontSize: "1.4rem" }}>
            Loading product details...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "var(--nav-h)",
            textAlign: "center",
            padding: "6rem 2rem",
          }}
        >
          <p style={{ fontFamily: "var(--ff-serif)", fontSize: "1.4rem" }}>
            Product not found
          </p>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px" }}>
        <div className="product-detail-inner">
          <div className="product-detail-gallery">
            <div className="product-detail-main-img">
              <img src={product.img} alt={product.name} />
            </div>
          </div>

          <div className="product-detail-info">
            <span className="section-label">{product.category}</span>
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-detail-price">
              <span className="product-detail-current">{product.price}</span>
              {product.oldPrice && (
                <s style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                  {product.oldPrice}
                </s>
              )}
            </div>

            <div className="product-detail-stars">
              ★★★★★{" "}
              <span>
                {product.stars} ({product.reviews} Reviews)
              </span>
            </div>

            <p className="product-detail-desc">{product.desc}</p>

            <div className="product-detail-perks">
              {product.perks.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>

            <div className="product-detail-actions">
              <button
                className="btn btn-dark"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button
                className="product-wish"
                onClick={handleWishlist}
                style={{ color: wished ? "#c97b7b" : "" }}
              >
                {wished ? "♥" : "♡"}
              </button>
            </div>

            <div className="product-detail-accord">
              <details open>
                <summary>The Arrangement</summary>
                <ul>
                  {product.stems.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
