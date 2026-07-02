import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const banners = [
  {
    image: "/images/shopbook_banner_1.png",
    link: "/flash-sale",
  },
  {
    image: "/images/shopbook_banner_2.png",
    link: "/new-books",
  },
  {
    image: "/images/shopbook_banner_3.png",
    link: "/best-seller",
  },
];

const HomeBanner = () => {
  const [current, setCurrent] = useState(0);

  const nextBanner = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextBanner, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <section className="home-banner-slider">
      <button className="banner-arrow banner-left" onClick={prevBanner}>
        ‹
      </button>

      <Link to={banner.link} className="banner-image-link">
        <img src={banner.image} alt="ShopBook Banner" />
      </Link>

      <button className="banner-arrow banner-right" onClick={nextBanner}>
        ›
      </button>

      <div className="banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={current === index ? "active" : ""}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HomeBanner;