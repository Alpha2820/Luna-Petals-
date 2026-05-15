import React from "react";
import { API_BASE_URL } from "../../api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATUSES = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    if (!token) {
      navigate("/admin");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        throw new Error(data.message || "Failed to load orders");
      }
      setOrders(data);
    } catch (err) {
      console.error(err);
      setOrders([]);
      if (err.message.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchOrders();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [token, navigate]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const statusColor = (status) => {
    if (status === "Delivered")
      return { bg: "var(--blush)", color: "var(--rose-dark)" };
    if (status === "Out for Delivery")
      return { bg: "var(--lavender)", color: "var(--brown-mid)" };
    if (status === "Preparing") return { bg: "#fff3e0", color: "#e65100" };
    return { bg: "var(--off-white)", color: "var(--text-muted)" };
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "var(--brown)",
          color: "var(--blush)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        <span
          style={{
            fontFamily: "var(--ff-serif)",
            fontSize: "1.6rem",
            fontStyle: "italic",
            color: "var(--white)",
            marginBottom: ".25rem",
          }}
        >
          Luna Petals
        </span>
        <span
          style={{
            fontSize: ".65rem",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: "3rem",
          }}
        >
          Admin Panel
        </span>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            flex: 1,
          }}
        >
          {[
            { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
            { label: "Orders", icon: "📦", path: "/admin/orders" },
            { label: "Products", icon: "🌸", path: "/admin/products" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".75rem",
                padding: ".85rem 1rem",
                borderRadius: "10px",
                color: "var(--blush)",
                fontSize: ".9rem",
                background:
                  item.path === "/admin/orders"
                    ? "rgba(255,255,255,.1)"
                    : "transparent",
                transition: "background .2s",
                textDecoration: "none",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin");
          }}
          style={{
            background: "rgba(255,255,255,.1)",
            border: "none",
            color: "var(--blush)",
            padding: ".85rem 1rem",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: ".9rem",
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            fontFamily: "var(--ff-sans)",
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "3rem" }}>
        {/* HEADER */}
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
            Manage
          </span>
          <h1
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "2.5rem",
              fontWeight: 400,
              color: "var(--brown)",
              marginTop: ".25rem",
            }}
          >
            Orders
          </h1>
        </div>

        {/* ORDERS */}
        {loading ? (
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "4rem",
            }}
          >
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              borderRadius: "16px",
              padding: "4rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</p>
            <p style={{ color: "var(--text-muted)" }}>No orders yet</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {orders.map((order) => {
              const sc = statusColor(order.status);
              return (
                <div
                  key={order._id}
                  style={{
                    background: "var(--white)",
                    borderRadius: "16px",
                    padding: "1.75rem 2rem",
                    boxShadow: "var(--shadow-sm)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
                >
                  {/* ORDER INFO */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--ff-serif)",
                        fontSize: "1.2rem",
                        color: "var(--brown)",
                        marginBottom: ".25rem",
                      }}
                    >
                      {order.orderNumber}
                    </div>
                    <div
                      style={{ fontSize: ".78rem", color: "var(--text-muted)" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div>
                    <div
                      style={{
                        fontSize: ".9rem",
                        color: "var(--brown)",
                        fontWeight: 500,
                      }}
                    >
                      {order.customer.firstName} {order.customer.lastName}
                    </div>
                    <div
                      style={{ fontSize: ".78rem", color: "var(--text-muted)" }}
                    >
                      {order.customer.city}, {order.customer.state}
                    </div>
                  </div>

                  {/* PRODUCT + TOTAL */}
                  <div>
                    <div style={{ fontSize: ".9rem", color: "var(--text)" }}>
                      {order.items?.[0]?.name || "—"}
                      {order.items?.length > 1
                        ? ` +${order.items.length - 1} more`
                        : ""}
                    </div>
                    <div
                      style={{
                        fontSize: ".85rem",
                        color: "var(--rose)",
                        fontWeight: 500,
                        marginTop: ".2rem",
                      }}
                    >
                      ₹{order.total.toLocaleString()}
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <div>
                    <span
                      style={{
                        fontSize: ".72rem",
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        padding: ".35rem .9rem",
                        borderRadius: "100px",
                        fontWeight: 500,
                        background: sc.bg,
                        color: sc.color,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* UPDATE STATUS */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                      minWidth: "180px",
                    }}
                  >
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      disabled={
                        updating === order._id || order.status === "Delivered"
                      }
                      style={{
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        padding: ".6rem .9rem",
                        fontFamily: "var(--ff-sans)",
                        fontSize: ".85rem",
                        color: "var(--text)",
                        background: "var(--off-white)",
                        outline: "none",
                        cursor:
                          order.status === "Delivered"
                            ? "not-allowed"
                            : "pointer",
                        opacity: updating === order._id ? 0.6 : 1,
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {updating === order._id && (
                      <span
                        style={{
                          fontSize: ".72rem",
                          color: "var(--text-muted)",
                          textAlign: "center",
                        }}
                      >
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
