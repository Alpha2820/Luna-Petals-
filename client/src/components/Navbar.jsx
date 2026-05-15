import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  useEffect(() => {
    const nav = navRef.current;
    const handleScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Shop", href: "/" },
    { label: "Our Products", href: "/products" },
    { label: "Our Story", href: "/#story" },
    { label: "Track Order", href: "/tracking" },
  ];

  return (
    <>
      <nav className="nav" ref={navRef}>
        <div className="nav-inner">
          {/* HAMBURGER */}
          <button
            className="nav-menu"
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* LOGO */}
          <Link className="nav-logo" to="/">
            Luna Petals
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="nav-links">
            {navLinks.map((link) =>
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <li key={link.label}>
                  <Link to={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <a href={link.href} className="nav-link">
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          {/* ICONS */}
          <div className="nav-actions">
            <a href="#" aria-label="Search">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </a>
            <Link to="/wishlist" className="nav-cart" aria-label="Wishlist">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="cart-dot">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/checkout" className="nav-cart" aria-label="Cart">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
            </Link>
            {user ? (
              <Link to="/profile" className="nav-user">
                <span className="nav-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{`Hi, ${user.name.split(" ")[0]}`}</span>
              </Link>
            ) : (
              <Link to="/login" className="nav-account">
                Account
              </Link>
            )}
            {user && (
              <button type="button" className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* OUTSIDE CLICK OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42,31,31,.45)",
            backdropFilter: "blur(4px)",
            zIndex: 98,
          }}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100svh",
          width: "280px",
          background: "var(--cream)",
          zIndex: 99,
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .35s cubic-bezier(.25,.46,.45,.94)",
          boxShadow: menuOpen ? "var(--shadow-lg)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="nav-logo" style={{ fontSize: "1.4rem" }}>
            Luna Petals
          </span>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {navLinks.map((link) => (
            <li
              key={link.label}
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  to={link.href}
                  style={{
                    display: "block",
                    padding: "1rem 0",
                    fontFamily: "var(--ff-serif)",
                    fontSize: "1.3rem",
                    color: "var(--brown)",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "1rem 0",
                    fontFamily: "var(--ff-serif)",
                    fontSize: "1.3rem",
                    color: "var(--brown)",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <Link
          to="/wishlist"
          onClick={() => setMenuOpen(false)}
          style={{
            display: "block",
            padding: "1rem 0",
            fontFamily: "var(--ff-serif)",
            fontSize: "1.3rem",
            color: "var(--brown)",
            fontWeight: 400,
            borderBottom: "1px solid var(--border)",
          }}
        >
          My Wishlist ({wishlistCount})
        </Link>

        <Link
          to="/profile"
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center" }}
        >
          My Account
        </Link>
        {user && (
          <button
            type="button"
            className="btn btn-dark"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
        <Link
          to="/checkout"
          className="btn btn-dark"
          style={{ width: "100%", justifyContent: "center" }}
        >
          View Cart
        </Link>
      </div>
    </>
  );
}
