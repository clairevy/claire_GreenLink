import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = (searchParams.get("role") || "buyer").toLowerCase();

  // Account + business fields
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);
  // Cooperative-specific fields
  const [productTypes, setProductTypes] = useState([]); // ['rau','qua','khac']
  const [supplyCapacity, setSupplyCapacity] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState("");
  const [certifications, setCertifications] = useState([]); // ['VietGAP','Hữu cơ','ISO','Khác']
  const [otherCertification, setOtherCertification] = useState("");
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState(null);
  const [registeredUsername, setRegisteredUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const validatePhone = (p) => {
    const ph = p.replace(/\s+/g, "");
    return /^\+?[0-9]{7,15}$/.test(ph);
  };

  const validateCorporateEmail = (e) => {
    // Email công ty (không cho Gmail/Yahoo/Hotmail)
    const blockedDomains = ["yahoo.com", "hotmail.com"];
    const domain = e.split("@")[1]?.toLowerCase();
    if (!domain || blockedDomains.includes(domain)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
    ) {
      setError("Chỉ chấp nhận file PDF, JPG, PNG");
      e.target.value = null;
      return;
    }
    setBusinessLicense(file);
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = files.filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    if (allowed.length !== files.length) {
      setError("Hình ảnh chỉ chấp nhận JPG/PNG");
      return;
    }
    setImages(allowed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required basic fields
    if (
      !companyName ||
      !contactName ||
      !phone ||
      !email ||
      !password ||
      !termsChecked
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc và đồng ý điều khoản.");
      return;
    }

    if (username && (username.length < 6 || username.length > 30)) {
      setError("Tên đăng nhập phải có 6-30 ký tự.");
      return;
    }

    if (!validateCorporateEmail(email)) {
      setError(
        "Vui lòng nhập email công ty hợp lệ (không dùng Gmail/Yahoo/Hotmail)."
      );
      return;
    }

    if (!validatePhone(phone)) {
      setError("Số điện thoại không hợp lệ. Hãy nhập số hợp lệ.");
      return;
    }

    if (password.length < 6 || !/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      setError("Mật khẩu phải ít nhất 6 ký tự, bao gồm số và ký tự đặc biệt.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      // Build FormData so we can send files (businessLicense + images)
      const formData = new FormData();
      formData.append(
        "username",
        username || companyName.replace(/\s+/g, "_").toLowerCase()
      );
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("companyName", companyName);
      formData.append("contactName", contactName);
      formData.append("phone", phone);
      formData.append("taxId", taxId);
      formData.append("address", address);

      // Cooperative fields
      formData.append("productTypes", JSON.stringify(productTypes || []));
      formData.append("supplyCapacity", supplyCapacity || "");
      formData.append("deliveryAreas", deliveryAreas || "");
      formData.append("certifications", JSON.stringify(certifications || []));
      formData.append("otherCertification", otherCertification || "");

      if (businessLicense) formData.append("businessLicense", businessLicense);
      if (images && images.length)
        images.forEach((f) => formData.append("images", f));

      // Use fetch directly so we can let the browser set multipart headers
      // 3️⃣ Gửi đăng ký
      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

      const registerRes = await fetch(`${base}/auth/register`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const text = await registerRes.text();
      let data = null;
      try {
        if (text) data = JSON.parse(text);
      } catch (e) {}

      if (!registerRes.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `Đăng ký thất bại (${registerRes.status})`;
        throw new Error(message);
      }

      // 4️⃣ Gửi email chào mừng (không block user)
      try {
        await fetch(`${base}/email/welcome`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: contactName,
          }),
        });
      } catch (err) {
        console.warn("Gửi email chào mừng thất bại:", err);
      }
      const regName =
        username || companyName.replace(/\s+/g, "_").toLowerCase();
      setRegisteredUsername(regName);
      setSuccess("Đăng ký thành công. Vui lòng xác nhận email để kích hoạt.");
      setLoading(false);
      // show modal with info and optional confirmUrl when SMTP not configured
      if (data?.confirmUrl) setConfirmUrl(data.confirmUrl);
      setShowModal(true);
    } catch (err) {
      setError(err?.message || "Lỗi mạng");
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-row">
        <div className="register-hero-top">
          <h1>Đăng ký bán hàng chuyên nghiệp</h1>
          <p>
            Quản lý đơn hàng và hợp tác mua sỉ hiệu quả với GreenBanana Coop.
          </p>
          <div className="illustration" aria-hidden="true"></div>
        </div>

        <div className="register-right">
          <div className="register-card">
            <h2 className="mb-2">Đăng ký hợp tác - Doanh nghiệp</h2>
            <p className="muted">
              Vui lòng điền thông tin doanh nghiệp để bắt đầu.
            </p>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="row">
                <label>
                  Tên doanh nghiệp<span className="required">*</span>
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="gb-input"
                  placeholder="Tên công ty / doanh nghiệp"
                  required
                />
              </div>

              <div className="row two">
                <div>
                  <label>
                    Người liên hệ<span className="required">*</span>
                  </label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="gb-input"
                    placeholder="Họ và tên người liên hệ"
                    required
                  />
                </div>
                <div>
                  <label>
                    Số điện thoại<span className="required">*</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="gb-input"
                    placeholder="Ví dụ: +84123456789"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <label>
                  Email liên hệ<span className="required">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="gb-input"
                  type="email"
                  placeholder="email@congty.com"
                  required
                />
              </div>

              <div className="row two">
                <div>
                  <label>
                    Mật khẩu<span className="required">*</span>
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="gb-input"
                    type="password"
                    placeholder="Mật khẩu"
                    required
                  />
                </div>
                <div>
                  <label>
                    Xác nhận mật khẩu<span className="required">*</span>
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="gb-input"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                </div>
              </div>

              <div className="row two">
                <div>
                  <label>Mã số thuế</label>
                  <input
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="gb-input"
                    placeholder="MST (nếu có)"
                  />
                </div>
                <div>
                  <label>Địa chỉ</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="gb-input"
                    placeholder="Địa chỉ trụ sở"
                  />
                </div>
              </div>

              {/* Role selector */}
              <div className="row">
                <label>Loại tài khoản</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={role === "buyer"}
                      onChange={(e) => setRole(e.target.value)}
                    />{" "}
                    Người mua
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="supplier"
                      checked={role === "supplier"}
                      onChange={(e) => setRole(e.target.value)}
                    />{" "}
                    Nhà cung cấp
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="cooperative"
                      checked={role === "cooperative"}
                      onChange={(e) => setRole(e.target.value)}
                    />{" "}
                    HTX / Hợp tác xã
                  </label>
                </div>
              </div>

              {/* Cooperative-specific section */}
              {role === "cooperative" && (
                <>
                  <h3 style={{ marginTop: 12 }}>Thông tin HTX / Hợp tác xã</h3>
                  <div className="row">
                    <label>Loại sản phẩm cung cấp</label>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <label>
                        <input
                          type="checkbox"
                          value="rau"
                          checked={productTypes.includes("rau")}
                          onChange={(e) => {
                            const v = "rau";
                            setProductTypes((pt) =>
                              pt.includes(v)
                                ? pt.filter((x) => x !== v)
                                : [...pt, v]
                            );
                          }}
                        />{" "}
                        Rau
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="qua"
                          checked={productTypes.includes("qua")}
                          onChange={(e) => {
                            const v = "qua";
                            setProductTypes((pt) =>
                              pt.includes(v)
                                ? pt.filter((x) => x !== v)
                                : [...pt, v]
                            );
                          }}
                        />{" "}
                        Quả
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="khac"
                          checked={productTypes.includes("khac")}
                          onChange={(e) => {
                            const v = "khac";
                            setProductTypes((pt) =>
                              pt.includes(v)
                                ? pt.filter((x) => x !== v)
                                : [...pt, v]
                            );
                          }}
                        />{" "}
                        Nông sản khác
                      </label>
                    </div>
                  </div>

                  <div className="row two">
                    <div>
                      <label>
                        Dung lượng / năng lực cung ứng (VD: 500 kg/tuần)
                      </label>
                      <input
                        className="gb-input"
                        value={supplyCapacity}
                        onChange={(e) => setSupplyCapacity(e.target.value)}
                        placeholder="Số kg/tuần, tháng"
                      />
                    </div>
                    <div>
                      <label>Khu vực giao hàng / vùng hoạt động</label>
                      <input
                        className="gb-input"
                        value={deliveryAreas}
                        onChange={(e) => setDeliveryAreas(e.target.value)}
                        placeholder="Tỉnh / Huyện / Vùng"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <label>Tiêu chuẩn chất lượng / chứng nhận</label>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <label>
                        <input
                          type="checkbox"
                          value="VietGAP"
                          checked={certifications.includes("VietGAP")}
                          onChange={(e) => {
                            const v = "VietGAP";
                            setCertifications((c) =>
                              c.includes(v)
                                ? c.filter((x) => x !== v)
                                : [...c, v]
                            );
                          }}
                        />{" "}
                        VietGAP
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Hữu cơ"
                          checked={certifications.includes("Hữu cơ")}
                          onChange={(e) => {
                            const v = "Hữu cơ";
                            setCertifications((c) =>
                              c.includes(v)
                                ? c.filter((x) => x !== v)
                                : [...c, v]
                            );
                          }}
                        />{" "}
                        Hữu cơ
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="ISO"
                          checked={certifications.includes("ISO")}
                          onChange={(e) => {
                            const v = "ISO";
                            setCertifications((c) =>
                              c.includes(v)
                                ? c.filter((x) => x !== v)
                                : [...c, v]
                            );
                          }}
                        />{" "}
                        ISO
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Khác"
                          checked={certifications.includes("Khác")}
                          onChange={(e) => {
                            const v = "Khác";
                            setCertifications((c) =>
                              c.includes(v)
                                ? c.filter((x) => x !== v)
                                : [...c, v]
                            );
                          }}
                        />{" "}
                        Khác
                      </label>
                      {certifications.includes("Khác") && (
                        <input
                          className="gb-input"
                          placeholder="Ghi rõ chứng nhận khác"
                          value={otherCertification}
                          onChange={(e) =>
                            setOtherCertification(e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <label>
                      Hình ảnh HTX / nông trại / sản phẩm (tùy chọn)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleImagesUpload}
                    />
                    <div className="small muted">
                      {images.length
                        ? images.map((f) => f.name).join(", ")
                        : "Chưa có hình ảnh"}
                    </div>
                  </div>

                  <div className="row">
                    <label>
                      Giấy phép kinh doanh / Giấy phép HTX (file upload)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileUpload}
                    />
                    <div className="small muted">
                      {businessLicense ? businessLicense.name : "Chưa có file"}
                    </div>
                  </div>
                </>
              )}

              <div className="row">
                <label>Tên đăng nhập (tùy chọn)</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="gb-input"
                  placeholder="Tên tài khoản (nếu muốn)"
                />
              </div>

              <div className="row">
                <label>Giấy phép kinh doanh (tùy chọn)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="row">
                <label>
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    required
                  />{" "}
                  Tôi xác nhận là doanh nghiệp hợp pháp và đồng ý với{" "}
                  <a href="/terms">điều khoản sử dụng</a>.
                </label>
              </div>

              {error && <div className="text-red-600">{error}</div>}

              <div className="actions">
                <button
                  type="submit"
                  className="gb-btn primary"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Đăng ký ngay"}
                </button>
              </div>
            </form>

            {/* helper text moved into modal so page stays clean */}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#16A34A" />
                <path
                  d="M7 12.5l2.5 2.5L17 8"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="modal-title">Đăng ký thành công</h3>
            <p className="modal-message">{`Bạn đã đăng ký thành công${
              registeredUsername ? ` (${registeredUsername})` : ""
            }. Vui lòng xác nhận email để kích hoạt tài khoản.`}</p>
            {confirmUrl && (
              <div className="confirm-link">
                <div className="small muted">
                  Liên kết xác thực (dùng khi không có SMTP):
                </div>
                <a
                  href={confirmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="verify-link"
                >
                  Verify my account
                </a>
              </div>
            )}
            <div className="modal-actions">
              <button
                className="gb-btn ok-btn"
                onClick={() => {
                  setShowModal(false);
                  // navigate to login and prefill username
                  const qs = new URLSearchParams();
                  if (registeredUsername)
                    qs.set("username", registeredUsername);
                  navigate(`/login${qs.toString() ? `?${qs.toString()}` : ""}`);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
