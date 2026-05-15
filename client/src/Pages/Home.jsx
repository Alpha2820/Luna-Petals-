import Navbar from "../components/Navbar";
import hero from "../assets/hero_bouquet.png";
import wedding from "../assets/bouquet_wedding.png";
import birthday from "../assets/bouquet_birthday.png";
import anniversary from "../assets/bouquet_anniversary.png";
import proposal from "../assets/bouquet_proposal.png";
import surprise from "../assets/bouquet_surprise.png";
import ethereal from "../assets/product_ethereal.png";
import lavender from "../assets/product_lavender_dream.png";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const { user } = useAuth();
  const [addedIds, setAddedIds] = useState(new Set());
  const [PRODUCTS, setPRODUCTS] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fallback product data in case API fails
  const FALLBACK_PRODUCTS = [
    {
      _id: "ethereal-romance",
      name: "Ethereal Romance",
      price: 2499,
      category: "Blush & Ivory",
      image: ethereal,
      badge: "Bestseller",
      link: "/product/ethereal-romance",
    },
    {
      _id: "lavender-dream",
      name: "Lavender Dream",
      price: 1999,
      category: "Purple & Lavender",
      image: lavender,
      badge: "New",
      link: "/product/lavender-dream",
    },
    {
      _id: "red-desire",
      name: "Red Desire",
      price: 2799,
      category: "Red Roses",
      image: proposal,
      badge: null,
      link: "/product/red-desire",
    },
    {
      _id: "sunny-surprise",
      name: "Sunny Surprise",
      price: 1699,
      category: "Sunflowers & Joy",
      image: surprise,
      badge: "Sale",
      link: "/product/sunny-surprise",
      originalPrice: 2100,
    },
  ];

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/products");
        const data = await res.json();

        // Take first 4 products and format them
        const formattedProducts = (data.slice(0, 4) || []).map((product) => ({
          ...product,
          link: `/product/${product._id}`,
        }));

        setPRODUCTS(
          formattedProducts.length > 0 ? formattedProducts : FALLBACK_PRODUCTS,
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setPRODUCTS(FALLBACK_PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedIds((prev) => new Set([...prev, product._id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(product._id);
        return updated;
      });
    }, 1500);
  };

  const toggleWish = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  useEffect(() => {
    // SCROLL REVEAL
    const revealEls = document.querySelectorAll(
      ".product-card, .col-card, .testi-card, .perk, .story-inner, .insta-tile",
    );
    const style = document.createElement("style");
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity .6s ease ${i * 0.06}s, transform .6s ease ${i * 0.06}s`;
      revealObserver.observe(el);
    });

    // SMOOTH HASH SCROLL
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach((link) => {
      const handler = (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      link.addEventListener("click", handler);
    });

    // PARALLAX HERO
    const heroImg = document.querySelector(".hero-img");
    let parallaxHandler;
    if (heroImg && window.matchMedia("(min-width: 768px)").matches) {
      parallaxHandler = () => {
        heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.12}px)`;
      };
      window.addEventListener("scroll", parallaxHandler, { passive: true });
    }

    return () => {
      revealObserver.disconnect();
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
      if (parallaxHandler) {
        window.removeEventListener("scroll", parallaxHandler);
      }
    };
  }, []);
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-img-wrap">
          <img src={hero} alt="Luxury handmade bouquet" className="hero-img" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="hero-tag">New Collection — 2026</span>
          <h1 className="hero-title">
            Flowers that
            <br />
            <em>feel like love</em>
          </h1>
          <p className="hero-sub">
            Handcrafted bouquets for every moment that matters.
          </p>
          <div className="hero-ctas">
            <a href="#collections" className="btn btn-light">
              Shop Now
            </a>
            <a href="#story" className="btn btn-ghost-light">
              Our Story
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <span>Handmade with Love</span>
          <span className="dot">✦</span>
          <span>Same Day Delivery</span>
          <span className="dot">✦</span>
          <span>Custom Bouquets</span>
          <span className="dot">✦</span>
          <span>Instagram Fresh</span>
          <span className="dot">✦</span>
          <span>Premium Blooms</span>
          <span className="dot">✦</span>
          <span>Handmade with Love</span>
          <span className="dot">✦</span>
          <span>Same Day Delivery</span>
          <span className="dot">✦</span>
          <span>Custom Bouquets</span>
          <span className="dot">✦</span>
          <span>Instagram Fresh</span>
          <span className="dot">✦</span>
          <span>Premium Blooms</span>
          <span className="dot">✦</span>
        </div>
      </div>

      {/* COLLECTIONS GRID */}
      <section className="section collections" id="collections">
        <div className="section-header">
          <span className="section-label">Shop by Occasion</span>
          <h2 className="section-title">Find the perfect bloom</h2>
        </div>
        <div className="collections-grid">
          <Link
            to="/product/bridal-elegance"
            className="col-card col-card--large"
          >
            <img src={wedding} alt="Wedding bouquet" />
            <div className="col-card-overlay"></div>
            <div className="col-card-info">
              <span className="col-card-tag">Weddings</span>
              <h3>Bridal Elegance</h3>
              <span className="col-card-arrow">→</span>
            </div>
          </Link>

          <Link to="/product/birthday-bloom" className="col-card">
            <img src={birthday} alt="Birthday bouquet" />
            <div className="col-card-overlay"></div>
            <div className="col-card-info">
              <span className="col-card-tag">Birthdays</span>
              <h3>Birthday Bloom</h3>
              <span className="col-card-arrow">→</span>
            </div>
          </Link>

          <Link to="/product/modern-romance" className="col-card">
            <img src={anniversary} alt="Anniversary bouquet" />
            <div className="col-card-overlay"></div>
            <div className="col-card-info">
              <span className="col-card-tag">Anniversary</span>
              <h3>Modern Romance</h3>
              <span className="col-card-arrow">→</span>
            </div>
          </Link>

          <Link to="/product/red-desire" className="col-card">
            <img src={proposal} alt="Proposal bouquet" />
            <div className="col-card-overlay"></div>
            <div className="col-card-info">
              <span className="col-card-tag">Proposals</span>
              <h3>Say Yes</h3>
              <span className="col-card-arrow">→</span>
            </div>
          </Link>

          <Link to="/product/sunny-surprise" className="col-card">
            <img src={surprise} alt="Surprise gift" />
            <div className="col-card-overlay"></div>
            <div className="col-card-info">
              <span className="col-card-tag">Surprise Gifts</span>
              <h3>Just Because</h3>
              <span className="col-card-arrow">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section products" id="products">
        <div className="section-header">
          <span className="section-label">Bestsellers</span>
          <h2 className="section-title">Most loved bouquets</h2>
        </div>
        <div className="products-grid">
          {loadingProducts ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "6rem 0",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</div>
              <p style={{ fontFamily: "var(--ff-serif)", fontSize: "1.4rem" }}>
                Loading bouquets...
              </p>
            </div>
          ) : (
            PRODUCTS.map((product) => (
              <Link
                key={product._id}
                to={product.link}
                style={{ textDecoration: "none" }}
              >
                <div className="product-card">
                  <div className="product-img-wrap">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                    />
                    <div className="product-actions">
                      <button
                        className="product-wish"
                        aria-label="Wishlist"
                        onClick={(e) => toggleWish(e, product)}
                      >
                        {isWished(product._id) ? "♥" : "♡"}
                      </button>
                      <button
                        className="product-quick"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        {addedIds.has(product._id) ? "✓ Added" : "Quick Add"}
                      </button>
                    </div>
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
                  <div className="product-info">
                    <span className="product-cat">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-bottom">
                      <span className="product-price">
                        ₹{product.price?.toLocaleString?.() || product.price}
                        {product.oldPrice &&
                          product.oldPrice > product.price && (
                            <s>
                              ₹
                              {product.oldPrice?.toLocaleString?.() ||
                                product.oldPrice}
                            </s>
                          )}
                      </span>
                      <button
                        className="btn-add"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        {addedIds.has(product._id) ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="section-cta">
          <a href="/products" className="btn btn-outline">
            View All Products
          </a>
        </div>
      </section>
      {/* STORY SECTION */}
      <section className="story" id="story">
        <div className="story-inner">
          <div className="story-img-wrap">
            <img src={birthday} alt="Florist crafting a bouquet" />
            <div className="story-accent"></div>
          </div>
          <div className="story-text">
            <span className="section-label">Our Philosophy</span>
            <h2 className="story-title">
              Crafted with intention,
              <br />
              <em>delivered with grace</em>
            </h2>
            <p>
              At Luna Petalss, we believe flowers are more than decoration —
              they are a language. Every stem is hand-selected and arranged by
              our master florists to create living sculptures that breathe love,
              emotion, and unparalleled elegance.
            </p>
            <p>
              Born on Instagram, grown through genuine moments shared between
              people who care. We're not just a flower shop — we're your
              memory-makers.
            </p>
            <a href="#" className="btn btn-dark">
              Read Our Story →
            </a>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="perks">
        <div className="perks-inner">
          <div className="perk">
            <div className="perk-icon">🌸</div>
            <h4>Hand-Picked Blooms</h4>
            <p>Fresh, ethically sourced flowers selected daily</p>
          </div>
          <div className="perk">
            <div className="perk-icon">🚚</div>
            <h4>Same Day Delivery</h4>
            <p>Order before 2 PM for same-day surprises</p>
          </div>
          <div className="perk">
            <div className="perk-icon">🎀</div>
            <h4>Custom Packaging</h4>
            <p>Luxury wrapping with handwritten cards</p>
          </div>
          <div className="perk">
            <div className="perk-icon">💬</div>
            <h4>WhatsApp Support</h4>
            <p>Direct chat with our floral experts</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials">
        <div className="section-header">
          <span className="section-label">Love Notes</span>
          <h2 className="section-title">What our customers say</h2>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p>
              "The bouquet was absolutely stunning. My girlfriend cried the
              moment she saw it. Luna Petalss made our anniversary
              unforgettable."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">A</div>
              <div>
                <strong>Aryan M.</strong>
                <span>Anniversary Bouquet</span>
              </div>
            </div>
          </div>
          <div className="testi-card testi-card--accent">
            <div className="testi-stars">★★★★★</div>
            <p>
              "I've ordered 4 times now. Every single bouquet looks even better
              than the photos. The packaging is luxury level — worth every
              rupee!"
            </p>
            <div className="testi-author">
              <div className="testi-avatar">P</div>
              <div>
                <strong>Priya K.</strong>
                <span>Repeat Customer</span>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p>
              "Ordered for my best friend's birthday with same-day delivery. The
              florist even added a custom note. Totally exceeded my
              expectations!"
            </p>
            <div className="testi-author">
              <div className="testi-avatar">S</div>
              <div>
                <strong>Sneha R.</strong>
                <span>Birthday Bloom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="insta-section">
        <div className="insta-header">
          <h2>
            Follow <em>@luna.petalss</em>
            <br />
            on Instagram
          </h2>
          <a
            href="https://www.instagram.com/luna.petalss"
            target="_blank"
            className="btn btn-dark"
            rel="noreferrer"
          >
            Follow Us
          </a>
        </div>
        <div className="insta-grid">
          <a href="#" className="insta-tile">
            <img src={hero} alt="Instagram post" />
          </a>
          <a href="#" className="insta-tile">
            <img src={wedding} alt="Instagram post" />
          </a>
          <a href="#" className="insta-tile">
            <img src={ethereal} alt="Instagram post" />
          </a>
          <a href="#" className="insta-tile">
            <img src={anniversary} alt="Instagram post" />
          </a>
          <a href="#" className="insta-tile">
            <img src={lavender} alt="Instagram post" />
          </a>
          <a href="#" className="insta-tile">
            <img src={proposal} alt="Instagram post" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
