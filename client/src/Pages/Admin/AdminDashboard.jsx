import React from "react";
import { API_BASE_URL } from "../../api";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

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

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [token, navigate]);

  // Refetch when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchOrders();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [token, navigate]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status !== "Delivered").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📦",
      color: "var(--brown)",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "var(--rose)",
    },
    { label: "Pending", value: pending, icon: "🚚", color: "var(--brown-mid)" },
    {
      label: "Delivered",
      value: delivered,
      icon: "✅",
      color: "var(--rose-dark)",
    },
  ];

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
                  item.path === "/admin/dashboard"
                    ? "rgba(255,255,255,.1)"
                    : "transparent",
                transition: "background .2s",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
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

      {/* MAIN CONTENT */}
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
            Overview
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
            Dashboard
          </h1>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--white)",
                borderRadius: "16px",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--ff-serif)",
                  fontSize: "2rem",
                  color: stat.color,
                  fontWeight: 400,
                  marginBottom: ".25rem",
                }}
              >
                {loading ? "..." : stat.value}
              </div>
              <div
                style={{
                  fontSize: ".75rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ORDERS */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
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
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              style={{
                fontSize: ".8rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--rose)",
              }}
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              Loading...
            </p>
          ) : orders.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              No orders yet 🌸
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[
                    "Order #",
                    "Customer",
                    "Product",
                    "Total",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: ".75rem 1rem",
                        fontSize: ".7rem",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: ".9rem 1rem",
                        fontSize: ".85rem",
                        color: "var(--brown)",
                        fontWeight: 500,
                      }}
                    >
                      {order.orderNumber}
                    </td>
                    <td
                      style={{
                        padding: ".9rem 1rem",
                        fontSize: ".85rem",
                        color: "var(--text)",
                      }}
                    >
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td
                      style={{
                        padding: ".9rem 1rem",
                        fontSize: ".85rem",
                        color: "var(--text)",
                      }}
                    >
                      {order.items?.[0]?.name || "—"}
                      {order.items?.length > 1
                        ? ` +${order.items.length - 1} more`
                        : ""}
                    </td>
                    <td
                      style={{
                        padding: ".9rem 1rem",
                        fontSize: ".85rem",
                        color: "var(--brown)",
                        fontWeight: 500,
                      }}
                    >
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td style={{ padding: ".9rem 1rem" }}>
                      <span
                        style={{
                          fontSize: ".72rem",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: ".3rem .8rem",
                          borderRadius: "100px",
                          fontWeight: 500,
                          background:
                            order.status === "Delivered"
                              ? "var(--blush)"
                              : order.status === "Out for Delivery"
                                ? "var(--lavender)"
                                : "var(--off-white)",
                          color:
                            order.status === "Delivered"
                              ? "var(--rose-dark)"
                              : order.status === "Out for Delivery"
                                ? "var(--brown-mid)"
                                : "var(--text-muted)",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: ".9rem 1rem",
                        fontSize: ".8rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
