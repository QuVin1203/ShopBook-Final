import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import ProductItem from "./ProductItem";
import { useGetProductsQuery } from "../../redux/api/productApi";

const BestSeller = () => {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    resPerPage: 100,
  });

  if (isLoading) return <Loader />;

  const products = data?.products || [];

  const bestSellerProducts = [...products]
    .filter((product) => Number(product?.sold || 0) > 0)
    .sort((a, b) => Number(b?.sold || 0) - Number(a?.sold || 0))
    .slice(0, 12);

  return (
    <>
      <MetaData title="Best Seller - ShopBook" />

      <div className="best-seller-page">
        <section className="best-seller-hero">
          <div className="best-seller-content">
            <span className="best-badge">🏆 BEST SELLER</span>

            <h1>Most Loved Books</h1>

            <p>Discover the books readers are buying the most on ShopBook.</p>

            <div className="best-stats">
              <div>
                <strong>{bestSellerProducts.length}</strong>
                <span>Top Books</span>
              </div>

              <div>
                <strong>{bestSellerProducts[0]?.sold || 0}</strong>
                <span>Highest Sold</span>
              </div>

              <div>
                <strong>★★★★★</strong>
                <span>Reader Choice</span>
              </div>
            </div>
          </div>
        </section>

        <div className="best-toolbar">
          <div>
            <h2>🏆 Best Seller Collection</h2>
            <p>Books with the highest sales volume.</p>
          </div>

          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>

        {bestSellerProducts.length > 0 ? (
          <div className="best-grid">
            {bestSellerProducts.map((product) => (
              <ProductItem
                key={product?._id}
                product={product}
                columnSize={3}
              />
            ))}
          </div>
        ) : (
          <div className="best-empty">
            <h3>No best seller products yet.</h3>
            <p>Products will appear here after customers place orders.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BestSeller;