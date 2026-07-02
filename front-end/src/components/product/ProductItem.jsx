import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { addToWishlist } from "../../redux/features/wishlistSlice";

const ProductItem = ({ product, columnSize }) => {
  const dispatch = useDispatch();

  const [flashSaleTimeLeft, setFlashSaleTimeLeft] = useState("");

  const originalPrice = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const flashSaleDiscount = Number(product?.flashSaleDiscount || 0);

  const checkFlashSaleActive = () => {
    if (
      !product?.isFlashSale ||
      !product?.flashSaleStartTime ||
      !product?.flashSaleEndTime
    ) {
      return false;
    }

    const now = new Date();
    const start = new Date(product.flashSaleStartTime);
    const end = new Date(product.flashSaleEndTime);

    return now >= start && now <= end;
  };

  const flashSaleActive = checkFlashSaleActive();

  const finalDiscount =
    flashSaleActive && flashSaleDiscount > 0 ? flashSaleDiscount : discount;

  const discountedPrice =
    originalPrice - (originalPrice * finalDiscount) / 100;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  const getFlashSaleTimeLeft = () => {
    if (!product?.flashSaleEndTime) return "";

    const now = new Date();
    const end = new Date(product.flashSaleEndTime);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (!flashSaleActive) {
      setFlashSaleTimeLeft("");
      return;
    }

    setFlashSaleTimeLeft(getFlashSaleTimeLeft());

    const timer = setInterval(() => {
      setFlashSaleTimeLeft(getFlashSaleTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [
    product?.isFlashSale,
    product?.flashSaleStartTime,
    product?.flashSaleEndTime,
    flashSaleActive,
  ]);

  const addWishlistHandler = (e) => {
    e.preventDefault();

    dispatch(
      addToWishlist({
        product: product?._id,
        name: product?.name,
        image: product?.image?.[0]?.url,
        price: discountedPrice,
      })
    );

    toast.success("Added to wishlist");
  };

  return (
    <div className={`col-sm-6 col-md-4 col-lg-${columnSize} mb-4`}>
      <div className="product-card">
        <button className="wishlist-btn" onClick={addWishlistHandler}>
          <FaHeart />
        </button>

        <Link to={`/product/${product?._id}`} className="product-image-link">
          <div className="product-image-box">
            <img
              src={product?.image?.[0]?.url || "/images/product.png"}
              alt={product?.name}
              className="product-image"
            />
          </div>
        </Link>

        <div className="product-body">
          <div className="product-top-area">
            <div className="badge-row">
              {finalDiscount > 0 && (
                <span className="deal-badge">TOP DEAL</span>
              )}

              {flashSaleActive && (
                <span className="flash-badge">FLASH SALE</span>
              )}
            </div>

            <div className="flash-time-wrapper">
              {flashSaleActive && (
                <div className="flash-sale-time">
                  ⏰ Ends in: <strong>{flashSaleTimeLeft}</strong>
                </div>
              )}
            </div>

            <h5 className="product-title">
              <Link to={`/product/${product?._id}`}>{product?.name}</Link>
            </h5>
          </div>

          <div className="product-middle-area">
            <div className="rating-row">
              <StarRatings
                rating={product?.ratings || 0}
                starRatedColor="#f7b500"
                starEmptyColor="#d8dee9"
                numberOfStars={5}
                name={`rating-${product?._id}`}
                starDimension="17px"
                starSpacing="1px"
              />

              <span className="review-count">
                ({product?.numOfReviews || 0})
              </span>
            </div>

            <div className="price-box">
              <div className="main-price">
                {formatPrice(discountedPrice)} ₫
              </div>

              <div className="discount-row">
                {finalDiscount > 0 ? (
                  <>
                    <span className="discount-box">-{finalDiscount}%</span>

                    <span className="old-price">
                      {formatPrice(originalPrice)} ₫
                    </span>
                  </>
                ) : (
                  <span className="discount-placeholder">&nbsp;</span>
                )}
              </div>
            </div>

            <div className="sold-count">
              Sold: {Number(product?.sold || 0).toLocaleString("vi-VN")}
            </div>
          </div>

          <div className="product-bottom-area">
            <hr />

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;