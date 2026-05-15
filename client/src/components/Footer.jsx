export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Luna Petalss</span>
          <p>
            Handmade floral luxury for every moment that matters. Based in
            India. Blooming everywhere.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a href="#" aria-label="WhatsApp">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h5>Shop</h5>
          <ul>
            <li>
              <a href="#">All Bouquets</a>
            </li>
            <li>
              <a href="#">Weddings</a>
            </li>
            <li>
              <a href="#">Birthdays</a>
            </li>
            <li>
              <a href="#">Anniversaries</a>
            </li>
            <li>
              <a href="#">Custom Orders</a>
            </li>
          </ul>
        </div>
        <div className="footer-links">
          <h5>Help</h5>
          <ul>
            <li>
              <a href="#">Delivery Info</a>
            </li>
            <li>
              <a href="#">Care Guide</a>
            </li>
            <li>
              <a href="#">Returns</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>
        <div className="footer-links">
          <h5>Company</h5>
          <ul>
            <li>
              <a href="#">Our Story</a>
            </li>
            <li>
              <a href="#">Sustainability</a>
            </li>
            <li>
              <a href="#">Wholesale</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Luna Petalss. All rights reserved.</span>
        <span>Made with 🌸 in India</span>
      </div>
    </footer>
  );
}
