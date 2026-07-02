import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h4>ShopBook</h4>
            <p>
              Discover romance, fantasy, mystery, history, and thousands of books in one place.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4>Categories</h4>
            <ul>
              <li>Romance</li>
              <li>Fantasy</li>
              <li>Mystery</li>
              <li>History</li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>Email: support@shopbook.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

        <hr />

        <p className="footer-bottom">
          © 2026 ShopBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;