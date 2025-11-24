import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./LoginPage.css";
import logo from "../../assets/images/logo.png";
import apiFetch from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const username = searchParams.get("username");
    if (confirmed) {
      setInfo("Tài khoản đã được xác nhận. Vui lòng đăng nhập.");
    }
    if (username) {
      setIdentifier(username);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { username: identifier, password };
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // data: { user, accessToken }
      const user = data.user;
      const token = data.accessToken;
      auth.login(token, user.role, user);

      // redirect by role
      if (user.role === "buyer") {
        navigate("/buyer/dashboard");
      } else if (user.role === "supplier" || user.role === "cooperative") {
        navigate("/supplier/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-page">
      <div className="login-illustration" aria-hidden>
        <div className="panel" />
      </div>

      <div className="login-card-wrap">
        <div className="login-card">
          <div className="login-logo">
            <img src={logo} alt="logo" style={{ height: 36 }} />
          </div>
          <div className="login-title">Đăng nhập</div>
          <div className="login-sub">Nhập thông tin để truy cập tài khoản</div>

          {info && <div className="info-box">{info}</div>}
          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập hoặc Email</label>
              <input
                className="form-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                placeholder="Tên đăng nhập hoặc email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mật khẩu"
                required
              />
            </div>

            <div className="row-inline">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Ghi nhớ
              </label>
              <Link to="/forgot" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button className="signin-btn" type="submit">
              Đăng nhập
            </button>
          </form>

          <div className="or-text">Hoặc đăng nhập bằng</div>
          <button className="social-btn">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="g"
              style={{ width: 18 }}
            />
            Google
          </button>

          <div className="signup-line">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
