import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/hero_bouquet.png";
import birthday from "../assets/bouquet_birthday.png";
import proposal from "../assets/bouquet_proposal.png";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      login(form);
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
                <h1>Sign In</h1>
                <p>
                  Access your Luna Petals account and continue shopping with
                  ease.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
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
                  Sign In
                </button>
              </form>

              <p className="auth-footnote">
                New here? <Link to="/signup">Create an account</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
