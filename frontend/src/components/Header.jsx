import React from "react";
import { Link } from "react-router-dom";
// Replace this image with your provided logo file at src/assets/logo.png
import logo from "../assets/images/logo.png";
import "../layouts/PublicLayout.css";

const Header = () => {
  return (
    <header className="gb-header">
      <div className="gb-header-inner">
        <div className="gb-logo">
          <Link to="/" className="gb-logo-link">
            <img src={logo} alt="GreenBanana Coop" className="gb-logo-img" />
            <span className="gb-logo-text">GreenBanana Coop</span>
          </Link>
        </div>

        <nav className="gb-nav">
          <Link to="/about">VỀ GREENBANANA COOP</Link>
          {/* <Link to="/products">Sản Phẩm & Dịch Vụ</Link> */}
          {/* <Link to="/network">Mạng Lưới HTX</Link> */}
          <Link to="/process">Quy Trình Vàng</Link>
        </nav>

        <div className="gb-cta">
          <Link to="/login" className="gb-btn login-btn">
            Đăng nhập
          </Link>

          <Link to="/register" className="gb-btn gb-btn-outline">
            Liên hệ hợp tác
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
