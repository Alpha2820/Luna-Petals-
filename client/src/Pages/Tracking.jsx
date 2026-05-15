import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const STEPS = [
  { id: 0, title: "Order Placed", desc: null },
  {
    id: 1,
    title: "Handmade with Love",
    desc: "Our florist is perfectly arranging your bouquet.",
  },
  { id: 2, title: "Out for Delivery", desc: "Rahul is on the way to you." },
  { id: 3, title: "Delivered", desc: "Your bloom has arrived! 🌸" },
];

const STATUS_TO_STEP = {
  "Order Placed": 0,
  Preparing: 1,
  "Out for Delivery": 2,
  Delivered: 3,
};

const STATUS_LABELS = [
  "🛒 Order Confirmed",
  "🌸 Being Prepared",
  "🚚 Out for Delivery",
  "✅ Delivered!",
];

function getTime(offsetMinutes) {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function Tracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [times, setTimes] = useState({});

  // ── Fetch real order from backend ──
  useEffect(() => {
    if (!id) {
      setLoadingOrder(false);
      return;
    }
    fetch(`${API}/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        // Set step based on real order status
        const step = STATUS_TO_STEP[data.status] ?? 0;
        setCurrentStep(step);
        // Record time for all completed steps
        const t = {};
        for (let i = 0; i <= step; i++) t[i] = getTime(0);
        setTimes(t);
      })
      .catch(console.error)
      .finally(() => setLoadingOrder(false));
  }, [id]);

  // ── Poll every 10s for live status updates ──
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      fetch(`${API}/api/orders/${id}`)
        .then((r) => r.json())
        .then((data) => {
          const step = STATUS_TO_STEP[data.status] ?? 0;
          setOrder(data);
          setCurrentStep((prev) => {
            if (step > prev) {
              setTimes((t) => ({ ...t, [step]: getTime(0) }));
            }
            return step;
          });
        })
        .catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  // ── Record time when step changes ──
  useEffect(() => {
    setTimes((prev) => ({
      ...prev,
      [currentStep]: prev[currentStep] || getTime(0),
    }));
  }, [currentStep]);

  const etaTimes = [getTime(150), getTime(120), getTime(90), "Delivered"];

  // ── Loading state ──
  if (loadingOrder) {
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
          }}
        >
          <p
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "1.5rem",
              color: "var(--text-muted)",
            }}
          >
            Loading your order... 🌸
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // ── Order not found ──
  if (!order && !loadingOrder) {
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
          <p
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "1.5rem",
              color: "var(--brown)",
            }}
          >
            Order not found 🌸
          </p>
          <Link to="/" className="btn btn-dark">
            Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px" }}>
        <div className="tracking-inner">
          {/* HEADER */}
          <div className="tracking-header">
            <div>
              <Link to="/" className="tracking-back">
                ← Back to Home
              </Link>
              <h1 className="tracking-title">Track Your Bloom</h1>
              <p className="tracking-sub">
                Order {order?.orderNumber || `#${id?.slice(-6).toUpperCase()}`}{" "}
                • {order?.customer?.firstName} {order?.customer?.lastName}
              </p>
            </div>
            <div
              className="tracking-status-badge"
              style={{
                background: currentStep === 3 ? "var(--rose)" : "var(--blush)",
                color: currentStep === 3 ? "var(--white)" : "var(--brown)",
                transition: "all .4s",
              }}
            >
              {STATUS_LABELS[currentStep]}
            </div>
          </div>

          {/* GRID */}
          <div className="tracking-grid">
            {/* LEFT: MAP */}
            <div className="tracking-map-card">
              <div className="tracking-map-placeholder">
                <div className="tracking-map-overlay"></div>
                <div className="tracking-map-content">
                  <div className="tracking-eta">
                    <span>Est. Arrival</span>
                    <strong>{etaTimes[currentStep]}</strong>
                  </div>
                  <div
                    className="tracking-pin"
                    style={{
                      animation:
                        currentStep === 2 ? "bounce 1s infinite" : "none",
                    }}
                  >
                    {currentStep === 3 ? "🏠" : "📍"}
                  </div>
                </div>
              </div>

              {/* PRODUCT SNAPSHOT */}
              {(order?.items?.length ?? 0) > 0 && (
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {order.items[0].image && (
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--ff-serif)",
                        fontSize: "1rem",
                        color: "var(--brown)",
                      }}
                    >
                      {order.items[0].name}
                      {order.items.length > 1
                        ? ` +${order.items.length - 1} more`
                        : ""}
                    </div>
                    <div
                      style={{ fontSize: ".8rem", color: "var(--text-muted)" }}
                    >
                      ₹{order.total?.toLocaleString()} •{" "}
                      {order.deliverySlot?.replace("-", " ")}
                    </div>
                  </div>
                </div>
              )}

              {/* COURIER */}
              <div className="tracking-courier">
                <div className="tracking-courier-info">
                  <div className="tracking-courier-avatar">R</div>
                  <div>
                    <strong>Rahul</strong>
                    <span>
                      {currentStep === 0 && "Preparing your order..."}
                      {currentStep === 1 && "Picking up your bouquet..."}
                      {currentStep === 2 && "⭐ 4.9 • On the way!"}
                      {currentStep === 3 && "✅ Delivered successfully"}
                    </span>
                  </div>
                </div>
                <div className="tracking-courier-actions">
                  <button
                    className="tracking-btn-secondary"
                    disabled={currentStep < 2}
                    style={{ opacity: currentStep < 2 ? 0.4 : 1 }}
                  >
                    💬
                  </button>
                  <button
                    className="tracking-btn-primary"
                    disabled={currentStep < 2}
                    style={{ opacity: currentStep < 2 ? 0.4 : 1 }}
                  >
                    📞
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div style={{ padding: "0 1.5rem 1.5rem" }}>
                <div
                  style={{
                    height: "4px",
                    background: "var(--blush)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                      background: "var(--rose)",
                      borderRadius: "2px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: ".5rem",
                    fontSize: ".7rem",
                    color: "var(--text-muted)",
                    letterSpacing: ".08em",
                  }}
                >
                  <span>Order Placed</span>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            {/* RIGHT: TIMELINE */}
            <div className="tracking-timeline-card">
              <h2 className="tracking-timeline-title">Delivery Updates</h2>
              <div className="tracking-timeline">
                {STEPS.map((step, i) => {
                  const isDone = i < currentStep;
                  const isActive = i === currentStep;
                  const isPending = i > currentStep;
                  return (
                    <div
                      key={step.id}
                      className={`tracking-step ${isDone ? "tracking-step--done" : isActive ? "tracking-step--active" : "tracking-step--pending"}`}
                      style={{ transition: "opacity .5s" }}
                    >
                      <div
                        className={`tracking-dot ${isDone ? "tracking-dot--done" : isActive ? "tracking-dot--active" : "tracking-dot--pending"}`}
                      >
                        {isDone ? "✓" : ""}
                      </div>
                      <div>
                        <h4>{step.title}</h4>
                        {(isDone || isActive) && times[i] && (
                          <span>Today, {times[i]}</span>
                        )}
                        {isPending && <span>Upcoming</span>}
                        {(isDone || isActive) && step.desc && (
                          <p>{step.desc}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentStep === 3 && (
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.25rem",
                    background: "var(--blush)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--ff-serif)",
                      fontSize: "1.2rem",
                      color: "var(--brown)",
                      marginBottom: ".75rem",
                    }}
                  >
                    Your bloom has arrived! 🌸
                  </p>
                  <Link
                    to="/"
                    className="btn btn-dark"
                    style={{ display: "inline-flex" }}
                  >
                    Shop Again
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <Footer />
    </>
  );
}
