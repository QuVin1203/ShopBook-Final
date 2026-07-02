import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import ProductItem from "./ProductItem";
import { useGetProductsQuery } from "../../redux/api/productApi";

const FlashSale = () => {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    resPerPage: 100,
  });

  if (isLoading) return <Loader />;

  const products = data?.products || [];
  const now = new Date();

  const flashSaleProducts = products
    .filter((product) => {
      if (!product?.isFlashSale) return false;
      if (!product?.flashSaleStartTime || !product?.flashSaleEndTime) {
        return false;
      }

      const start = new Date(product.flashSaleStartTime);
      const end = new Date(product.flashSaleEndTime);

      return now >= start && now <= end;
    })
    .sort(
      (a, b) =>
        Number(b?.flashSaleDiscount || 0) -
        Number(a?.flashSaleDiscount || 0)
    )
    .slice(0, 12);

  const bestFlashDiscount = flashSaleProducts[0]?.flashSaleDiscount || 0;

  return (
    <>
      <MetaData title="Flash Sale - ShopBook" />

      <div className="flash-sale-page">
        <section className="flash-sale-main-hero">
          <div className="flash-sale-content">
            <span className="flash-sale-badge">⚡ FLASH SALE</span>

            <h1>Limited Time Book Deals</h1>

            <p>
              Grab your favorite books before the countdown ends. Special prices
              are available for a limited time only.
            </p>

            <div className="flash-sale-stats">
              <div>
                <strong>{flashSaleProducts.length}</strong>
                <span>Active Deals</span>
              </div>

              <div>
                <strong>{bestFlashDiscount ? `-${bestFlashDiscount}%` : "0%"}</strong>
                <span>Best Discount</span>
              </div>

              <div>
                <strong>2h</strong>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flash-sale-toolbar">
          <div>
            <h2>⚡ Flash Sale Books</h2>
            <p>{flashSaleProducts.length} limited-time offers available</p>
          </div>

          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>

        {flashSaleProducts.length > 0 ? (
          <div className="flash-sale-grid">
            {flashSaleProducts.map((product) => (
              <ProductItem
                key={product?._id}
                product={product}
                columnSize={3}
              />
            ))}
          </div>
        ) : (
          <div className="flash-sale-empty">
            <h3>No active flash sale products.</h3>
            <p>Please come back later for new limited-time deals.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FlashSale;