import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../../assets/hero_bouquet.png";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--cream)",
        overflow: "hidden",
      }}
    >
      {/* LEFT — FLOWER IMAGE */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={hero}
          alt="Luna Petals"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(42,31,31,.3), rgba(42,31,31,.6))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--white)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "3rem",
              fontStyle: "italic",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Luna Petals
          </span>
          <p
            style={{
              fontSize: ".8rem",
              letterSpacing: ".25em",
              textTransform: "uppercase",
              opacity: 0.8,
              marginBottom: "2rem",
            }}
          >
            Admin Portal
          </p>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(255,255,255,.5)",
            }}
          />
          <p
            style={{
              marginTop: "2rem",
              fontSize: ".9rem",
              opacity: 0.7,
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: "280px",
            }}
          >
            Manage your blooms, orders and deliveries all in one place.
          </p>
        </div>
      </div>

      {/* RIGHT — LOGIN FORM */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            background: "var(--white)",
            borderRadius: "20px",
            padding: "2.5rem",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontSize: ".7rem",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--rose)",
                fontWeight: 500,
              }}
            >
              Welcome Back
            </span>
            <h1
              style={{
                fontFamily: "var(--ff-serif)",
                fontSize: "2.2rem",
                fontWeight: 400,
                color: "var(--brown)",
                marginTop: ".5rem",
                lineHeight: 1.1,
              }}
            >
              Sign in to <br />
              <em style={{ fontStyle: "italic", color: "var(--rose)" }}>
                your dashboard
              </em>
            </h1>
          </div>

          {/* FORM */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}
            >
              <label
                style={{
                  fontSize: ".75rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  border: `1.5px solid ${error ? "var(--rose-dark)" : "var(--border)"}`,
                  borderRadius: "8px",
                  padding: ".85rem 1rem",
                  fontFamily: "var(--ff-sans)",
                  fontSize: ".9rem",
                  color: "var(--text)",
                  background: "var(--off-white)",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}
            >
              <label
                style={{
                  fontSize: ".75rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  border: `1.5px solid ${error ? "var(--rose-dark)" : "var(--border)"}`,
                  borderRadius: "8px",
                  padding: ".85rem 1rem",
                  fontFamily: "var(--ff-sans)",
                  fontSize: ".9rem",
                  color: "var(--text)",
                  background: "var(--off-white)",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fff5f5",
                  border: "1px solid var(--rose-dark)",
                  borderRadius: "8px",
                  padding: ".75rem 1rem",
                  fontSize: ".8rem",
                  color: "var(--rose-dark)",
                  textAlign: "center",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn btn-dark"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: ".5rem",
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "🔒 Sign In"}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: ".75rem",
              color: "var(--text-muted)",
              marginTop: "1.5rem",
            }}
          >
            🌸 Restricted access — authorised personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
