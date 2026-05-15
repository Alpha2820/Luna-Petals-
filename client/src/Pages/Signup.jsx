import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/hero_bouquet.png";
import wedding from "../assets/bouquet_wedding.png";
import surprise from "../assets/bouquet_surprise.png";

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Enter your name to continue.");
      return;
    }

    try {
      signup(form);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px" }}>
        <section className="auth-page">
          <div className="auth-card auth-card--split">
            <div className="auth-image-panel">
              <img src={hero} alt="Luxury bouquet" className="auth-hero-img" />
            </div>

            <div className="auth-content">
              <div className="auth-heading">
                <h1>Create Account</h1>
                <p>
                  Sign up to save your bouquets, orders, and payment records.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </label>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn btn-dark">
                  Create account
                </button>
              </form>

              <p className="auth-footnote">
                Already registered? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
