import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

const DELIVERY = 150;

export default function Checkout() {
  // ✅ useCart INSIDE the component, not outside
  const { cart, cartTotal, clearCart, updateQty, removeFromCart } = useCart();
  const { user, addOrder } = useAuth();

  const tax = Math.round(cartTotal * 0.09);
  const total = cartTotal + DELIVERY + tax;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [slot, setSlot] = useState("today-morning");
  const [ordered, setOrdered] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pin: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.name.split(" ")[0] || prev.firstName,
        lastName: user.name.split(" ").slice(1).join(" ") || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pin.trim()) e.pin = "Required";
    else if (!/^\d{6}$/.test(form.pin)) e.pin = "Must be 6 digits";
    return e;
  };

  const handleOrder = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const first = document.querySelector(".checkout-field-error");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          pin: form.pin,
        },
        // ✅ uses real cart first item
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.qty,
        })),
        total,
        deliverySlot: slot,
        paymentMethod,
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      setOrdered(true);
      clearCart(); // ✅ clear cart after successful order

      if (user) {
        addOrder({
          ...payload,
          _id: data._id,
          createdAt: new Date().toISOString(),
          status: "Confirmed",
        });
      }

      setTimeout(() => navigate(`/tracking/${data._id}`), 1500);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (name) => ({
    border: `1.5px solid ${errors[name] ? "var(--rose-dark)" : "var(--border)"}`,
    borderRadius: "8px",
    padding: ".7rem 1rem",
    fontFamily: "var(--ff-sans)",
    fontSize: ".9rem",
    color: "var(--text)",
    background: errors[name] ? "#fff5f5" : "var(--off-white)",
    outline: "none",
    transition: "border .2s",
    width: "100%",
  });

  // ✅ redirect to cart if empty
  if (cart.length === 0 && !ordered) {
    return (
      <>
        <Navbar />
        <main
          style={{
            paddingTop: "68px",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "2rem" }}>🌸</p>
          <p
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "1.5rem",
              color: "var(--brown)",
            }}
          >
            Your cart is empty
          </p>
          <a href="/" className="btn btn-dark">
            Shop Now
          </a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px" }}>
        <div className="checkout-inner">
          {/* LEFT: FORMS */}
          <div className="checkout-left">
            <div className="checkout-card">
              <h2 className="checkout-card-title">🚚 Shipping Information</h2>
              <div className="checkout-form">
                <div className="checkout-row">
                  <div className="checkout-field">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={handleChange}
                      style={fieldStyle("firstName")}
                    />
                    {errors.firstName && (
                      <span
                        className="checkout-field-error"
                        style={{
                          color: "var(--rose-dark)",
                          fontSize: ".72rem",
                          marginTop: ".2rem",
                        }}
                      >
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="checkout-field">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      style={fieldStyle("lastName")}
                    />
                    {errors.lastName && (
                      <span
                        className="checkout-field-error"
                        style={{
                          color: "var(--rose-dark)",
                          fontSize: ".72rem",
                          marginTop: ".2rem",
                        }}
                      >
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="checkout-field">
                  <label>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    style={fieldStyle("email")}
                  />
                  {errors.email && (
                    <span
                      className="checkout-field-error"
                      style={{
                        color: "var(--rose-dark)",
                        fontSize: ".72rem",
                        marginTop: ".2rem",
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="checkout-field">
                  <label>Street Address</label>
                  <input
                    name="address"
                    type="text"
                    placeholder="123 Blossom Lane, Apartment 4B"
                    value={form.address}
                    onChange={handleChange}
                    style={fieldStyle("address")}
                  />
                  {errors.address && (
                    <span
                      className="checkout-field-error"
                      style={{
                        color: "var(--rose-dark)",
                        fontSize: ".72rem",
                        marginTop: ".2rem",
                      }}
                    >
                      {errors.address}
                    </span>
                  )}
                </div>

                <div className="checkout-row">
                  <div className="checkout-field">
                    <label>City</label>
                    <input
                      name="city"
                      type="text"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      style={fieldStyle("city")}
                    />
                    {errors.city && (
                      <span
                        className="checkout-field-error"
                        style={{
                          color: "var(--rose-dark)",
                          fontSize: ".72rem",
                          marginTop: ".2rem",
                        }}
                      >
                        {errors.city}
                      </span>
                    )}
                  </div>
                  <div className="checkout-field">
                    <label>State</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      style={fieldStyle("state")}
                    >
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Uttar Pradesh</option>
                      <option>Tamil Nadu</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                    </select>
                  </div>
                  <div className="checkout-field">
                    <label>PIN Code</label>
                    <input
                      name="pin"
                      type="text"
                      placeholder="400001"
                      value={form.pin}
                      onChange={handleChange}
                      maxLength={6}
                      style={fieldStyle("pin")}
                    />
                    {errors.pin && (
                      <span
                        className="checkout-field-error"
                        style={{
                          color: "var(--rose-dark)",
                          fontSize: ".72rem",
                          marginTop: ".2rem",
                        }}
                      >
                        {errors.pin}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-card">
              <h2 className="checkout-card-title">🕐 Delivery Slot</h2>
              <div className="checkout-slots">
                {[
                  { id: "today-morning", label: "Today", sub: "10 AM – 1 PM" },
                  { id: "today-evening", label: "Today", sub: "2 PM – 5 PM" },
                  { id: "tomorrow", label: "Tomorrow", sub: "Morning" },
                  { id: "custom", label: "Custom", sub: "Select Date" },
                ].map((s) => (
                  <div
                    key={s.id}
                    className={`checkout-slot ${slot === s.id ? "checkout-slot--active" : ""}`}
                    onClick={() => setSlot(s.id)}
                  >
                    <span>{s.label}</span>
                    <small>{s.sub}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkout-card">
              <h2 className="checkout-card-title">💳 Payment Method</h2>
              <div className="checkout-payments">
                {[
                  {
                    id: "upi",
                    label: "UPI (GPay, PhonePe, Paytm)",
                    icon: "📱",
                  },
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((p) => (
                  <div
                    key={p.id}
                    className={`checkout-payment ${paymentMethod === p.id ? "checkout-payment--active" : ""}`}
                    onClick={() => setPaymentMethod(p.id)}
                  >
                    <span>
                      {p.icon} {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="checkout-right">
            <div className="checkout-summary">
              <h2 className="checkout-card-title">Order Summary</h2>

              {/* ✅ real cart items */}
              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <div className="checkout-item-info">
                      <strong>{item.name}</strong>
                      <span>₹{item.price.toLocaleString()} each</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".5rem",
                          background: "var(--off-white)",
                          borderRadius: "6px",
                          padding: ".25rem",
                        }}
                      >
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            minWidth: "20px",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span
                        style={{
                          fontWeight: "600",
                          minWidth: "80px",
                          textAlign: "right",
                        }}
                      >
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          border: "none",
                          background: "#ffe0e0",
                          color: "var(--rose-dark)",
                          cursor: "pointer",
                          padding: ".4rem .8rem",
                          borderRadius: "4px",
                          fontSize: ".75rem",
                          fontWeight: "600",
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#ffcccc")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#ffe0e0")
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-promo">
                <input type="text" placeholder="Promo Code" />
                <button className="btn btn-dark">Apply</button>
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Delivery</span>
                  <span>₹{DELIVERY}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Taxes (9%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="checkout-total-row checkout-total-row--final">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {apiError && (
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
                  ⚠️ {apiError}
                </div>
              )}

              {Object.keys(errors).length > 0 && !apiError && (
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
                  ⚠️ Please fill in all required fields correctly
                </div>
              )}

              <button
                className="btn btn-dark"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={handleOrder}
                disabled={loading || ordered}
              >
                {ordered
                  ? "✓ Order Placed!"
                  : loading
                    ? "Placing Order..."
                    : "🔒 Place Order Securely"}
              </button>
              <p className="checkout-secure">🛡️ Encrypted and secure payment</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
