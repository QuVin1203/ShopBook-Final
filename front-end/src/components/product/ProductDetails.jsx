import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";
import StarRatings from "react-star-ratings";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );

  const product = data?.product;
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    setActiveImg(product?.image?.[0]?.url || "/images/product.png");
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  const originalPrice = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);

  const discountedPrice =
    discount > 0
      ? originalPrice - (originalPrice * discount) / 100
      : originalPrice;

  const oldPrice =
    discount > 0 ? originalPrice : Math.floor(originalPrice * 1.15);

  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");

  const increaseQty = () => {
    if (quantity >= product?.stock) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCart = () => {
    dispatch(
      setCartItem({
        product: product?._id,
        name: product?.name,
        price: discountedPrice,
        image: product?.image?.[0]?.url,
        stock: product?.stock,
        quantity,
      })
    );

    toast.success("Item added to cart");
  };

  const buyNowHandler = () => {
    if (user?.role === "admin") {
      toast.error("Admin cannot place orders");
      return;
    }

    addToCart();
    navigate("/shipping");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="pd-page">
      <div className="pd-main-layout">
        <div className="pd-gallery-card">
          <div className="pd-main-image">
            <img src={activeImg} alt={product?.name} />
          </div>

          <div className="pd-thumbnails">
            {product?.image?.map((img) => (
              <button
                key={img?.public_id || img?.url}
                type="button"
                className={`thumb-btn ${activeImg === img?.url ? "active" : ""}`}
                onClick={() => setActiveImg(img?.url)}
              >
                <img src={img?.url} alt={product?.name} />
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info-card">
          <div className="pd-breadcrumb">Official Book Store</div>

          <h1 className="pd-title">{product?.name}</h1>

          <div className="pd-meta-line">
            <span>Product # {product?._id}</span>
            <span className="pd-dot">•</span>
            <span>{product?.seller || "Unknown Author"}</span>
          </div>

          <div className="pd-rating">
            <StarRatings
              rating={product?.ratings || 0}
              starRatedColor="#ffb829"
              starEmptyColor="#d8dee9"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
            />

            <span>({product?.numOfReviews || 0} Reviews)</span>

            {product?.stock > 0 ? (
              <span className="pd-stock-badge">In stock</span>
            ) : (
              <span className="pd-stock-badge out">Out of stock</span>
            )}
          </div>

          <div className="pd-price-area">
            <span className="pd-current-price">
              {formatPrice(discountedPrice)} đ
            </span>

            {discount > 0 && (
              <>
                <del>{formatPrice(oldPrice)} đ</del>
                <span className="pd-discount">-{discount}%</span>
              </>
            )}
          </div>

          <div className="pd-author-short">
            <span>Author</span>
            <strong>{product?.seller || "Unknown"}</strong>
          </div>

          <div className="pd-shipping-box">
            <h4>Shipping information</h4>
            <p>
              🚚 Delivery within Ho Chi Minh City on the same day, other
              provinces and cities within 1 to 3 days.
            </p>
            <p>🎁 Free shipping for eligible orders.</p>
          </div>

          <div className="pd-purchase-box">
            <div className="pd-quantity-area">
              <span>Quantity</span>

              <div className="pd-qty">
                <button type="button" onClick={decreaseQty}>
                  -
                </button>

                <input value={quantity} readOnly />

                <button type="button" onClick={increaseQty}>
                  +
                </button>
              </div>
            </div>

            <div className="pd-subtotal">
              <span>Provisional</span>
              <strong>{formatPrice(discountedPrice * quantity)} đ</strong>
            </div>

            <div className="pd-action-row">
              <button
                className="pd-buy-btn"
                disabled={product?.stock <= 0}
                onClick={buyNowHandler}
              >
                BUY NOW
              </button>

              <button
                className="pd-cart-btn"
                onClick={addToCart}
                disabled={product?.stock <= 0}
              >
                <i className="fa fa-shopping-cart me-2"></i>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-detail-section">
        <div className="pd-detail-card">
          <h3>Description</h3>
          <p>
            {product?.description ||
              "No description available for this book."}
          </p>

          <div className="pd-author-line">
            <span>Author</span>
            <strong>{product?.seller || "Unknown"}</strong>
          </div>
        </div>
      </div>

      <div className="pd-review-section">
        <h3 className="reviews-title">
          Customer Reviews ({product?.reviews?.length || 0})
        </h3>

        <div className="pd-write-review-box">
          <h4>Write a Review</h4>

          {isAuthenticated ? (
            <NewReview productId={product?._id} />
          ) : (
            <div className="alert alert-danger mb-0">
              Login to post review
            </div>
          )}
        </div>

        {product?.reviews?.length > 0 ? (
          <ListReviews reviews={product?.reviews} hideTitle />
        ) : (
          <div className="pd-no-review-box">
            No reviews yet. Be the first person to review this book.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;