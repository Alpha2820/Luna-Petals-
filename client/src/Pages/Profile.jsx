import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ethereal from "../assets/product_ethereal.png";
import lavender from "../assets/product_lavender_dream.png";
import wedding from "../assets/bouquet_wedding.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("profile");
  const wishlistPreview = wishlist.slice(0, 3);

  if (!user) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "68px" }}>
          <section className="profile-guest">
            <div className="profile-guest-card">
              <h1>Welcome to your Luna account</h1>
              <p>
                Create an account to save your wishlist, track orders, and keep
                your delivery details ready.
              </p>
              <div className="profile-guest-actions">
                <Link to="/login" className="btn btn-dark">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Create Account
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const renderSection = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Past Orders</h3>
            </div>
            {(user.orders || []).length > 0 ? (
              <div className="profile-order-list">
                {user.orders.map((order) => (
                  <div key={order._id} className="profile-order-card">
                    <div>
                      <span className="order-label">Order</span>
                      <h4>#{order._id}</h4>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="order-label">Status</span>
                      <p>{order.status || "Confirmed"}</p>
                    </div>
                    <div>
                      <span className="order-label">Total</span>
                      <p>₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="order-label">Items</span>
                      <p>{order.items?.length || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-panel-card">
                <h4>No past orders yet</h4>
                <p>Every order you place will appear here automatically.</p>
                <Link to="/products" className="btn btn-dark">
                  Browse bouquets
                </Link>
              </div>
            )}
          </div>
        );
      case "payments":
        return (
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Payment History</h3>
            </div>
            {(user.paymentHistory || []).length > 0 ? (
              <div className="profile-payment-list">
                {user.paymentHistory.map((payment) => (
                  <div key={payment.id} className="profile-payment-card">
                    <div>
                      <span className="order-label">Amount</span>
                      <p>₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="order-label">Order</span>
                      <p>#{payment.orderId}</p>
                    </div>
                    <div>
                      <span className="order-label">Method</span>
                      <p>{payment.method}</p>
                    </div>
                    <div>
                      <span className="order-label">Date</span>
                      <p>{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-panel-card">
                <h4>No payment records yet</h4>
                <p>
                  Your paid orders will appear here as soon as they are
                  confirmed.
                </p>
                <Link to="/checkout" className="btn btn-outline">
                  Place an order
                </Link>
              </div>
            )}
          </div>
        );
      case "addresses":
        return (
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Saved Addresses</h3>
            </div>
            <div className="profile-panel-card">
              <h4>No saved addresses</h4>
              <p>
                Add delivery addresses to speed up checkout and avoid entering
                details again.
              </p>
              <button className="btn btn-dark">Add address</button>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Settings</h3>
            </div>
            <div className="profile-panel-card">
              <h4>Personalize your account</h4>
              <p>
                Update email preferences, password, and notification options.
              </p>
              <button className="btn btn-dark">Manage settings</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">My Wishlist</h3>
              <Link to="/wishlist" className="profile-view-all">
                View All →
              </Link>
            </div>
            <div className="profile-wishlist-grid">
              {wishlistPreview.length > 0 ? (
                wishlistPreview.map((product, index) => (
                  <div key={index} className="profile-wish-card">
                    <img
                      src={product.image || ethereal}
                      alt={product.name || "Wishlist item"}
                    />
                    <div className="profile-wish-overlay"></div>
                    <button className="profile-wish-heart">♥</button>
                    <div className="profile-wish-info">
                      <h4>{product.name || "Saved bouquet"}</h4>
                      <span>₹{product.price?.toLocaleString() ?? "1,999"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="profile-panel-card">
                  <h4>Your wishlist is empty</h4>
                  <p>Save bouquets to revisit them later.</p>
                  <Link to="/products" className="btn btn-dark">
                    Browse products
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "68px" }}>
        <div className="profile-inner">
          {/* SIDEBAR */}
          <aside className="profile-sidebar">
            {[
              { id: "profile", icon: "👤", label: "Profile" },
              { id: "orders", icon: "📦", label: "Past Orders" },
              { id: "payments", icon: "💳", label: "Payment History" },
              { id: "addresses", icon: "📍", label: "Saved Addresses" },
              { id: "settings", icon: "⚙️", label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                className={`profile-nav-item ${
                  activeTab === item.id ? "profile-nav-item--active" : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </aside>

          {/* MAIN */}
          <div className="profile-main">
            <div className="profile-header-card">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="profile-header-info">
                <div className="profile-header-top">
                  <h2 className="profile-name">{user.name}</h2>
                  <span className="profile-badge">🌸 Luna Member</span>
                </div>
                <p className="profile-email">{user.email}</p>
                <div className="profile-header-actions">
                  <button className="btn btn-dark">Edit Profile</button>
                  <button className="btn btn-outline" onClick={logout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {renderSection()}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
