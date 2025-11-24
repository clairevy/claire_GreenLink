import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import apiFetch from "../../utils/api";

// Cooperative carousel: fetches cooperatives and shows 3 cards, 'Tìm hiểu' links
const CooperativeCarousel = () => {
  const [coops, setCoops] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoops = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/user/public/cooperatives");
        setCoops(data || []);
        setError(null);
      } catch (err) {
        console.error("Coop fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoops();
  }, []);

  const next = () => setIndex((i) => (i + 1) % Math.max(1, coops.length));
  const prev = () =>
    setIndex((i) => (i - 1 + coops.length) % Math.max(1, coops.length));

  if (loading) {
    return (
      <section className="network-section">
        <div className="network-inner">
          <h2>MẠNG LƯỚI HTX</h2>
          <div className="coop-carousel loading">Đang tải...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="network-section">
        <div className="network-inner">
          <h2>MẠNG LƯỚI HTX</h2>
          <div className="coop-carousel error">
            Lỗi tải dữ liệu: {error}
          </div>
        </div>
      </section>
    );
  }

  if (!coops.length) {
    return (
      <section className="network-section">
        <div className="network-inner">
          <h2>MẠNG LƯỚI HTX</h2>
          <div className="coop-carousel empty">
            Chưa có hợp tác xã. Vui lòng seed data.
          </div>
        </div>
      </section>
    );
  }

  const visible = coops.slice(index, index + 3);
  if (visible.length < 3) visible.push(...coops.slice(0, 3 - visible.length));

  return (
    <section className="network-section">
      <div className="network-inner">
        <h2>MẠNG LƯỚI HTX</h2>
        <p className="gb-muted">
          Nơi hội tụ nhà sản xuất tận tình, chăm chỉ, nhiệt huyết và công nghệ
          GreenLink.
        </p>
        <div className="carousel-controls">
          <button onClick={prev} className="nav-btn">
            ◀
          </button>
          <div className="cards-row">
            {visible.map((c) => (
              <div key={c._id} className="coop-card">
                <div className="coop-media">
                  <img
                    src={c.photo || "/default-coop.png"}
                    alt={c.companyName || c.username}
                  />
                </div>
                <div className="coop-info">
                  <h3>{c.companyName || c.username}</h3>
                  <p className="address">{c.address || "Chưa có địa chỉ"}</p>
                  <Link to={`/cooperatives/${c._id}`} className="learn-btn">
                    Tìm hiểu
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <button onClick={next} className="nav-btn">
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ title, subtitle, image }) => (
  <article className="gb-card">
    <div
      className="gb-card-media"
      style={{ backgroundImage: `url(${image})` }}
      aria-hidden="true"
    />
    <h3 className="gb-card-title">{title}</h3>
    <p className="gb-card-sub">{subtitle}</p>
    <button className="gb-btn gb-btn-outline">Xem chi tiết</button>
  </article>
);

const HomePage = () => {
  return (
    <main className="gb-container">
      <section className="gb-hero">
        <div className="gb-hero-inner">
          <p className="gb-hero-kicker">TINH HOA NÔNG NGHIỆP CỦ CHI</p>
          <h1 className="gb-hero-title">GROW GREEN, GROW BETTER</h1>
          <h1 className="gb-hero-title">EMPOWERING COOPERATIVE</h1>
          <p className="gb-hero-lead">
            Chúng tôi không chỉ trồng rau. Chúng tôi kiến tạo niềm tin.
            GreenBanana Coop là hợp tác xã kiểu mới, nơi công nghệ GreenLink
            đóng góp và giá trị bản địa hòa quyện.
          </p>
          <div className="gb-hero-actions">
            <Link to="/register" className="gb-btn gb-btn-primary">
              Liên hệ hợp tác
            </Link>
          </div>
        </div>
      </section>

      <section className="gb-section gb-feature-strip">
        <div className="gb-feature">
          <h1>GREEN LINK</h1>

          <p>
            GreenBanana Coop là hợp tác xã kiểu mới, nơi công nghệ GreenLink đột
            phá và giá trị bản địa hòa quyện, mang đến những sản phẩm nông
            nghiệp minh bạch tuyệt đối. Khởi nguồn từ vùng đất thép Củ Chi,
            GreenBanana Coop ra đời từ trăn trở của 10 nhà sáng lập về điệp khúc
            "được mùa mất giá". Chúng tôi không chọn cách làm nông nghiệp truyền
            thống. Chúng tôi chọn lối đi riêng: Hợp Tác Xã Kiểu Mới.
          </p>
        </div>
      </section>
      <div className="gb-section-title1">SẢN PHẨM & DỊCH VỤ</div>
      <section className="gb-section gb-cards">
        <ProductCard
          title="Rau Cải Ngọt Củ Chi"
          subtitle="Sản phẩm tươi, an toàn"
          image="https://cdn.pixabay.com/photo/2014/02/12/18/11/lettuce-264826_1280.jpg"
        />
        <ProductCard
          title="Lá Chuối Tươi"
          subtitle="Chuẩn sạch, bảo quản tốt"
          image="https://vnn-imgs-f.vgcloud.vn/2019/03/31/10/goi-rau-cu-bang-la-chuoi-1.jpg?width=260&s=jfwLiLpXV2bevk4w3q1o_g"
        />
        <ProductCard
          title="Dịch vụ Giao nhận Xanh"
          subtitle="Giao nhanh, giữ tươi"
          image="https://cdn.vietnambiz.vn/171464876016439296/2020/5/26/dsc993251990419pm-15904799372261869195646.jpg"
        />
      </section>

      <section className="gb-section gb-network">
        <CooperativeCarousel />
      </section>

      <section className="gb-section gb-insights">
        <div className="insights-header">
          <div>
            <h2 className="insights-title">Quy Trình Vàng 4 Bước</h2>
            <p className="insights-subtitle">
              Tại Green Link, mỗi sản phẩm là kết quả của một hành trình được số
              hóa hoàn toàn trên nền tảng GreenLink độc quyền. Chúng tôi cam kết
              minh bạch từ canh tác, thu hoạch, đóng gói đến giao nhận, đảm bảo
              chất lượng và nguồn gốc rõ ràng cho từng sản phẩm.
            </p>
          </div>
          <button className="view-all-btn">View all</button>
        </div>
        <div className="insights-grid">
          <article className="insight-card">
            <div
              className="insight-image"
              style={{
                backgroundImage:
                  "url(https://cdn.pixabay.com/photo/2017/06/06/09/40/salad-2376777_1280.jpg)",
              }}
            ></div>
            <div className="insight-content">
              <span className="insight-date">Chi phí</span>
              <h3 className="insight-title-text">Giá cả hợp lý</h3>
              <p className="insight-desc">
                Ứng dụng công nghệ GreenLink để tối ưu hóa chi phí vận hành,
                giúp mang đến mức giá ổn định, công bằng nhất cho người tiêu
                dùng và đảm bảo lợi nhuận xứng đáng cho nông dân.
              </p>
            </div>
          </article>
          <article className="insight-card">
            <div
              className="insight-image"
              style={{
                backgroundImage:
                  "url(https://watermark.lovepik.com/photo/20211208/large/lovepik-farm-vegetable-greenhouse-picture_501595588.jpg)",
              }}
            ></div>
            <div className="insight-content">
              <span className="insight-date">Sản xuất</span>
              <h3 className="insight-title-text">Canh Tác Minh Bạch</h3>
              <p className="insight-desc">
                Mọi dữ liệu chăm sóc, thu hoạch đều được ghi nhận và lưu trữ trên
                nền tảng GreenLink, từ đó tạo nên hồ sơ minh bạch cho từng lô
                sản phẩm.
            
              </p>
            </div>
          </article>
          <article className="insight-card">
            <div
              className="insight-image"
              style={{
                backgroundImage:
                  "url(https://www.truclamphatfoods.com/wp-content/uploads/2022/06/22-1-436x400.png)",
              }}
            ></div>
            <div className="insight-content">
              <span className="insight-date">Điểm độc đáo</span>
              <h3 className="insight-title-text">Ứng dụng lá chuối để bảo vệ môi trường</h3>
              <p className="insight-desc">
                Sử dụng lá chuối tươi tự nhiên thay thế túi nilon trong đóng gói
                sản phẩm, góp phần giảm thiểu rác thải nhựa và bảo vệ môi
                trường.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
