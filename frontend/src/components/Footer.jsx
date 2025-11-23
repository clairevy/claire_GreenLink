import React from "react";
import { Link } from "react-router-dom";
import "../layouts/PublicLayout.css";

const Footer = () => {
  return (
    <footer className="gb-footer">
      <div className="gb-footer-inner">
        <div className="gb-footer-col">
          <h4>GreenBanana Hub</h4>
          <p className="gb-muted">Địa chỉ, liên hệ và thông tin chung.</p>
        </div>
        <div className="gb-footer-col">
          <h4>Khám Phá</h4>
          <ul>
            <li>
              <Link to="/about">Về chúng tôi</Link>
            </li>
            <li>
              <Link to="/products">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/network">Mạng lưới HTX</Link>
            </li>
          </ul>
        </div>
        <div className="gb-footer-col">
          <h4>Liên Hệ</h4>
          <p className="gb-muted">contact@greenbananacoop.vn</p>
        </div>
        <div className="gb-footer-col gb-footer-subscribe">
          <h4>Kết Nối</h4>
          <div className="gb-subscribe">
            <input aria-label="email" placeholder="Nhập email của bạn" />
            <button className="gb-btn gb-btn-primary">Đăng ký</button>
          </div>
        </div>
      </div>

      <div className="gb-footer-bottom">
        <div>© {new Date().getFullYear()} GreenBanana Coop</div>
        <div className="gb-footer-social">Social icons</div>
      </div>
    </footer>
  );
};

export default Footer;
