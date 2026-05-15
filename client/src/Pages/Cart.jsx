import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const DELIVERY = 150;

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const tax = Math.round(cartTotal * 0.09);
  const total = cartTotal + DELIVERY + tax;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px", minHeight: "70vh" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "4rem 2.5rem",
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <span
              style={{
                fontSize: ".7rem",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--rose)",
                fontWeight: 500,
              }}
            >
              Your
            </span>
            <h1
              style={{
                fontFamily: "var(--ff-serif)",
                fontSize: "3rem",
                fontWeight: 400,
                color: "var(--brown)",
                marginTop: ".25rem",
              }}
            >
              Shopping Cart
            </h1>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
              <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌸</p>
              <p
                style={{
                  fontFamily: "var(--ff-serif)",
                  fontSize: "1.8rem",
                  color: "var(--brown)",
                  marginBottom: ".75rem",
                }}
              >
                Your cart is empty
              </p>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                Looks like you haven't added any blooms yet.
              </p>
              <Link to="/" className="btn btn-dark">
                Shop Now
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 360px",
                gap: "2.5rem",
                alignItems: "start",
              }}
            >
              {/* LEFT — ITEMS */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      background: "var(--white)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* INFO */}
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: ".65rem",
                          letterSpacing: ".16em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.category}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--ff-serif)",
                          fontSize: "1.3rem",
                          color: "var(--brown)",
                          fontWeight: 400,
                          margin: ".2rem 0 .75rem",
                        }}
                      >
                        {item.name}
                      </h3>

                      {/* QTY CONTROLS */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".75rem",
                        }}
                      >
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "1.5px solid var(--border)",
                            background: "var(--off-white)",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--brown)",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "var(--brown)",
                            minWidth: "20px",
                            textAlign: "center",
                          }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "1.5px solid var(--border)",
                            background: "var(--off-white)",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--brown)",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* PRICE + REMOVE */}
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        gap: ".75rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--ff-serif)",
                          fontSize: "1.4rem",
                          color: "var(--brown)",
                        }}
                      >
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                      {item.qty > 1 && (
                        <span
                          style={{
                            fontSize: ".75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          ₹{item.price.toLocaleString()} each
                        </span>
                      )}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: ".75rem",
                          cursor: "pointer",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: ".78rem",
                    cursor: "pointer",
                    textAlign: "left",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    padding: ".5rem 0",
                  }}
                >
                  × Clear Cart
                </button>
              </div>

              {/* RIGHT — SUMMARY */}
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "var(--shadow-sm)",
                  position: "sticky",
                  top: "90px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--ff-serif)",
                    fontSize: "1.6rem",
                    fontWeight: 400,
                    color: "var(--brown)",
                  }}
                >
                  Order Summary
                </h2>

                {/* ITEM LIST */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".6rem",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: ".85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".6rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: ".85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: ".85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>Delivery</span>
                    <span>₹{DELIVERY}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: ".85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>Taxes (9%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "var(--ff-serif)",
                      fontSize: "1.4rem",
                      color: "var(--brown)",
                      fontWeight: 500,
                      paddingTop: ".6rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  className="btn btn-dark"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout →
                </button>

                <Link
                  to="/"
                  style={{
                    textAlign: "center",
                    fontSize: ".8rem",
                    color: "var(--text-muted)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
