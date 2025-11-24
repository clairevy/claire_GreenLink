import React, { useState } from "react";
import "./ProcessPage.css";

const processes = [
  {
    id: 1,
    title: "Hợp tác xã kiểu mô hình mới",
    subtitle: "Quy trình vàng và có sự tham gia có nhiều bên liên quan",
    description:
      "Với website của chúng tôi, các hợp tác xã nông nghiệp có thể áp dụng quy trình vàng 4 bước để nâng cao hiệu quả sản xuất và quản lý. Quy trình này bao gồm: Tư vấn chuyên gia, Giải pháp thông minh, Hợp tác tin cậy và Thực hành bền vững. Mỗi bước đều được thiết kế để đáp ứng nhu cầu cụ thể của các hợp tác xã, giúp họ tối ưu hóa nguồn lực và đạt được thành công lâu dài.",
    image: "https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg",
    icon: "👨‍🌾",
  },
  {
    id: 2,
    title: "Smart Solutions",
    subtitle: "Innovative technology for modern farming.",
    description:
      "Cutting-edge IoT sensors and AI analytics to optimize crop yields and resource management.",
    image: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg",
    icon: "🤖",
  },
  {
    id: 3,
    title: "Trusted Partnership",
    subtitle: "Building long-term relationships.",
    description:
      "Transparent collaboration and commitment to sustainable agricultural practices.",
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg",
    icon: "🤝",
  },
  {
    id: 4,
    title: "Sustainable Practices",
    subtitle: "Eco-friendly farming methods.",
    description:
      "Organic approaches that protect the environment while maximizing productivity.",
    image: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg",
    icon: "🌱",
  },
  {
    id: 5,
    title: "Quality Assurance",
    subtitle: "Premium product standards.",
    description:
      "Rigorous quality control and certification processes for every harvest.",
    image: "https://images.pexels.com/photos/2254069/pexels-photo-2254069.jpeg",
    icon: "✓",
  },
  {
    id: 6,
    title: "Market Access",
    subtitle: "Connecting farmers to buyers.",
    description:
      "Direct market linkages ensuring fair prices and consistent demand.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    icon: "🏪",
  },
];

const ProcessPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCard(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === 0 ? processes.length - 1 : prev - 1));
      setShowCard(true);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCard(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === processes.length - 1 ? 0 : prev + 1));
      setShowCard(true);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setShowCard(false);
    setTimeout(() => {
      setActiveIndex(index);
      setShowCard(true);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  const getItemClass = (index) => {
    const diff = index - activeIndex;
    const totalItems = processes.length;

    if (diff === 0) return "active";
    if (diff === 1 || diff === -(totalItems - 1)) return "next";
    if (diff === -1 || diff === totalItems - 1) return "prev";
    if (diff === 2 || diff === -(totalItems - 2)) return "next-2";
    if (diff === -2 || diff === totalItems - 2) return "prev-2";
    return "hidden";
  };

  return (
    <div className="process-page">
      <section className="process-hero">
        <div className="process-hero-content">
          <p className="process-kicker">WHY CHOOSE US?</p>
          <h1>
            Innovative Solutions
            <br />
            for Every Cooperative
          </h1>
          <p className="process-subtitle">
            Providing cooperatives smart, sustainable solutions to boost
            productivity and growth.
          </p>
        </div>
      </section>

      <section className="process-carousel-section">
        <div className="container">
          {/* Tags Navigation */}
          <div className="process-tags">
            {processes.map((process, index) => (
              <button
                key={process.id}
                className={`process-tag ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleDotClick(index)}
              >
                {process.title
                  .replace("Expert Guidance", "Expert")
                  .replace("#Smart Solutions", "#Smart")}
              </button>
            ))}
          </div>

          {/* Circular Carousel */}
          <div className="circular-carousel">
            <div className="carousel-ring">
              {processes.map((process, index) => (
                <div
                  key={process.id}
                  className={`carousel-item ${getItemClass(index)}`}
                  style={{
                    transform: `rotate(${
                      (index - activeIndex) * 60
                    }deg) translateY(-280px) rotate(${
                      -(index - activeIndex) * 60
                    }deg)`,
                  }}
                >
                  <div className="item-indicator">
                    <span className="item-number">{process.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Card */}
            <div className={`center-card ${showCard ? "show" : "hide"}`}>
              <div className="card-image">
                <img
                  src={processes[activeIndex].image}
                  alt={processes[activeIndex].title}
                />
                <div className="play-button">▶</div>
              </div>
              <div className="card-content">
                <h3>{processes[activeIndex].title}</h3>
                <p className="card-subtitle">
                  {processes[activeIndex].subtitle}
                </p>
                <p className="card-description">
                  {processes[activeIndex].description}
                </p>
                <button className="learn-more-btn">Learn More</button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="carousel-navigation">
              <button className="nav-arrow prev-arrow" onClick={handlePrev}>
                ←
              </button>
              <button className="nav-arrow next-arrow" onClick={handleNext}>
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProcessPage;
