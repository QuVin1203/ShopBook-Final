import React from "react";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import ProductItem from "./ProductItem";
import { useGetProductsQuery } from "../../redux/api/productApi";
import { Link } from "react-router-dom";

const TopDeals = () => {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    resPerPage: 100,
  });

  if (isLoading) return <Loader />;

  const products = data?.products || [];

  const topDealProducts = [...products]
    .filter((product) => Number(product?.discount || 0) > 0)
    .sort((a, b) => Number(b?.discount || 0) - Number(a?.discount || 0));

  return (
    <>
      <MetaData title="Top Deals - ShopBook" />

      <div className="top-deals-page">
        <section className="top-deals-hero">
          <div>
            <span className="top-deals-badge">🔥 TOP DEAL</span>
            <h1>Best Discount Books</h1>
            <p>
              Discover our biggest book deals with special prices and limited
              offers.
            </p>

            <div className="top-deals-stats">
              <div>
                <strong>{topDealProducts.length}</strong>
                <span>Deals</span>
              </div>

              <div>
                <strong>
                  {topDealProducts[0]?.discount
                    ? `-${topDealProducts[0]?.discount}%`
                    : "0%"}
                </strong>
                <span>Best Discount</span>
              </div>

              <div>
                <strong>2h</strong>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </section>

        <div className="top-deals-toolbar">
          <div>
            <h2>🔥 Top Deal Books</h2>
            <p>{topDealProducts.length} discounted books available</p>
          </div>

          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>

        {topDealProducts.length > 0 ? (
          <div className="top-deals-grid">
            {topDealProducts.map((product) => (
              <ProductItem
                key={product?._id}
                product={product}
                columnSize={3}
                showTopDealBadge={true}
              />
            ))}
          </div>
        ) : (
          <div className="top-deals-empty">
            <h3>No top deal products.</h3>
            <p>Please come back later for new offers.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TopDeals;