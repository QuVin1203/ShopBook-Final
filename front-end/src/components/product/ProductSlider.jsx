import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";

const ProductSlider = ({ title, products = [], viewAllLink = "/" }) => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 5;
  const showTopDealBadge = title?.toLowerCase().includes("top deal");

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  const nextProducts = () => {
    if (startIndex + visibleCount >= products.length) return;
    setStartIndex(startIndex + visibleCount);
  };

  const prevProducts = () => {
    if (startIndex === 0) return;
    setStartIndex(Math.max(startIndex - visibleCount, 0));
  };

  return (
    <section className="product-section-box">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={viewAllLink}>View all</Link>
      </div>

      {products.length > 0 ? (
        <div className="five-products-slider">
          <button
            type="button"
            className="five-slider-btn five-left"
            onClick={prevProducts}
            disabled={startIndex === 0}
          >
            ‹
          </button>

          <div className="five-products-grid">
            {visibleProducts.map((product) => (
              <ProductItem
                key={product?._id}
                product={product}
                columnSize={12}
                showTopDealBadge={showTopDealBadge}
              />
            ))}
          </div>

          <button
            type="button"
            className="five-slider-btn five-right"
            onClick={nextProducts}
            disabled={startIndex + visibleCount >= products.length}
          >
            ›
          </button>
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </section>
  );
};

export default ProductSlider;