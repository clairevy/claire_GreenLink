import React, { useEffect, useState } from "react";
import "./AboutPage.css";

const teamMembers = [
  {
    name: "Lê Thị Mỹ Hồng",
    role: "Thành viên nhóm GreenLink",
    image: "/src/assets/images/1.jpg",
  },
  {
    name: "Phạm Hồng Hạnh",
    role: "Thành viên nhóm GreenLink",
    image: "/src/assets/images/2.JPG",
  },
  {
    name: "Lê Ngọc Thảo Vy",
    role: "Thành viên nhóm GreenLink",
    image: "/src/assets/images/3.JPEG",
  },
  {
    name: "Lê Vũ Khánh Linh",
    role: "Thành viên nhóm GreenLink",
    image: "/src/assets/images/4.JPG",
  },
  {
    name: "Lê Trần Khánh Linh",
    role: "Thành viên nhóm GreenLink",
    image: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/588628571_1813861352577028_4618503016354757486_n.jpg?stp=dst-jpg_p480x480_tt6&_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeEEk5efcY428wh0HT3RX4lmdloGHiAa3kN2WgYeIBreQ-CUR76ZeRicUMntn1jqKE8U0O-Z5yB2Rk_n29u3oRDb&_nc_ohc=fIIzsf82rzYQ7kNvwGV038D&_nc_oc=AdmcrgBPvN5IUOo4W9Cu0rchgevYbneCFBBcZ6DDKgnO0thHfi4Kcd9d6F9NnrTxIqw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&oh=03_Q7cD3wFNvzj_FV2StseIsLpBqeKlZqlH29fzEbwtJ2hfQ9GOwQ&oe=694ABB0B",
  },
  {
    name: "Đỗ Ngọc Cẩm Tú",
    role: "Thành viên nhóm GreenLink",
    image: "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/585548027_1229158592371842_115002027205381705_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeGI5VeJZlDZROWmeRK_DEFIgHX0zpCBqPyAdfTOkIGo_KTvTUMERva9Zt_nimyr0Qu1MpE1KwxaJFkTkUQDq1EW&_nc_ohc=cCPlozG_wrAQ7kNvwGhh8dT&_nc_oc=AdkemkoNsFPXWYLfMmVS_R2mBwBu3la4kIlpuwKiRYdL89dMUQZATFvbr8p4AHn0Ht4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn5-13.fna&oh=03_Q7cD3wHEV9qC2wERu1h6YzFW8COxUFc4yfXPuTk17QHZJpURqQ&oe=694ABAEB",
  },
  {
    name: "Phan Mạnh Quỳnh",
    role: "Thành viên nhóm GreenLink",
    image: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/588624303_2130358421037506_3806247462064241074_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHWUOpx5XH_tTZdnoEosaMaJKMhd1-hgOUkoyF3X6GA5ePzT6pDMJ3KhLFoiAXzLXctm2g4e6oSidJn3dcUZzwy&_nc_ohc=5EZYkVyRC8wQ7kNvwGE0qWK&_nc_oc=AdlniCav9rkxiSn6uMmXCnr-FmDVA-F_wwRUkMpp6TB9PQHOhboTYkEtgmOs1fHZa84&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&oh=03_Q7cD3wH2-mYCQGew8kQtJvl8HU02Jgf9wG9CV_gUBRGPFhWINQ&oe=694ACC52",
  },
  {
    name: "Huỳnh Văn Sỹ",
    role: "Thành viên nhóm GreenLink",
    image: "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/583218929_1243941187589850_7816452047423932944_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeGfgCqz8kTmHqEPlgc-lAiVbZR1KaemVZFtlHUpp6ZVkQRQ4UJNGnwrUe7deD60s6rzUP2ZkIMnFpJdEw4QL8qa&_nc_ohc=RKpr0nJzr2kQ7kNvwFnogcS&_nc_oc=AdkwxN1TbbPDiS72EeKI1guiniBgAo3tdW2-FLAR8bAW-ImW7HjtdgoblTC-RIUPBmU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn5-13.fna&oh=03_Q7cD3wGvq3ILibv1XobAYozF15xuJkNCZhpZ63D3xb9f3WE0vg&oe=694B53DA",
  },
  {
    name: "Khang Phương",
    role: "Thành viên nhóm GreenLink",
    image: "https://images.pexels.com/photos/2254069/pexels-photo-2254069.jpeg",
  },
  {
    name: "Hoàng Văn Minh",
    role: "Thành viên nhóm GreenLink",
    image: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg",
  },
];

const Stat = ({ value, label }) => {
  const [num, setNum] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(String(value).replace("%", ""));
    if (isNaN(end)) return;
    const duration = 800;
    const stepTime = Math.abs(Math.floor(duration / Math.max(end, 1))) || 20;
    const timer = setInterval(() => {
      start += Math.max(1, Math.floor(end / (duration / stepTime)));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setNum(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="about-stat">
      <div className="about-stat-value">
        {num}
        {String(value).includes("%") ? "%" : ""}
      </div>
      <div className="about-stat-label">{label}</div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(teamMembers.length - itemsPerView, prev + 1)
    );
  };

  const visibleMembers = teamMembers.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-quote">
          <p>
          "Green Kink ra đời với sứ mệnh kết nối các hợp tác xã nông nghiệp với
            người mua, giúp minh bạch chuỗi cung ứng, nâng cao giá trị sản phẩm và
            thúc đẩy phát triển bền vững. Đây là đội ngũ sáng lập đầy tâm huyết,
            mong muốn tạo ra sự khác biệt tích cực cho ngành nông nghiệp Việt Nam."
          </p>
        </div>

        <div className="testimonials-carousel">
          <div className="carousel-track">
            {visibleMembers.map((member, index) => (
              <div
                className={`team-member-card ${index === 2 ? "center" : ""}`}
                key={currentIndex + index}
              >
                <div
                  className="member-photo"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="member-info">
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            <button
              className="carousel-btn prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ←
            </button>
            <button
              className="carousel-btn next"
              onClick={handleNext}
              disabled={currentIndex >= teamMembers.length - itemsPerView}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1>Nơi Sự Tinh Khiết Ươm Mầm</h1>
          <p>
            Kiến tạo nền tảng số tại Củ Chi — GreenLink kết nối HTX với thị
            trường
          </p>
          <a className="about-cta" href="/register">
            Đăng ký ngay
          </a>
        </div>
      </header>

      <section className="about-intro">
        <div className="about-intro-inner container">
          <div className="about-intro-left">
            <h2>Về Chúng Tôi</h2>
            <p>
              GreenLink kết nối các hợp tác xã nông nghiệp với người mua, giúp
              minh bạch chuỗi cung ứng, nâng cao giá trị sản phẩm và thúc đẩy
              phát triển bền vững.
            </p>
          </div>
          <div className="about-stats">
            <Stat value={10} label="Năm kinh nghiệm" />
            <Stat value={"100%"} label="Sản phẩm hữu cơ" />
            <Stat value={24} label="Đối tác vùng" />
          </div>
        </div>
      </section>
       <section className="video-section">
        <div className="container">
          <h2 className="video-title">Quy trình xử lý và đóng gói lá chuối</h2>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/cH6TAHOZnnE"
              title="The Power of Organic Farming"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>


      <section className="about-steps">
        <div className="container">
          <h3>Quy Trình</h3>
          <div className="steps-grid">
            <div className="step-card">
              <h4>01 Giá cả hợp lý</h4>
              <p>Chúng tôi đảm bảo giá cạnh tranh cho cả HTX và người mua.</p>
            </div>
            <div className="step-card">
              <h4>02 Canh tác minh bạch</h4>
              <p>Áp dụng chuẩn canh tác sạch, truy xuất nguồn gốc.</p>
            </div>
            <div className="step-card">
              <h4>03 Bao gói tận tâm</h4>
              <p>Bảo quản và đóng gói chuyên nghiệp để giữ chất lượng.</p>
            </div>
            <div className="step-card">
              <h4>04 Vận chuyển chuyên nghiệp</h4>
              <p>Đảm bảo giao hàng đúng hẹn và an toàn.</p>
            </div>
          </div>
        </div>
      </section>
     
      <TestimonialsSection />

      

     
    </div>
  );
};

export default AboutPage;
