import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setCartItem } from "../../redux/features/cartSlice";
import { removeFromWishlist } from "../../redux/features/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems } = useSelector((state) => state.wishlist);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  const addToCartHandler = (item) => {
    dispatch(
      setCartItem({
        product: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        stock: item.stock || 1,
        quantity: 1,
      })
    );
  };

  const buyNowHandler = (item) => {
    addToCartHandler(item);
    navigate("/shipping");
  };

  return (
    <div className="wishlist-page">
      <h2>❤️ My Wishlist</h2>

      {wishlistItems?.length === 0 ? (
        <div className="wishlist-empty">
          <h4>No wishlist items</h4>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.product} className="wishlist-card">
            <div className="wishlist-info">
              <img src={item.image} alt={item.name} />

              <Link to={`/product/${item.product}`} className="wishlist-name">
                {item.name}
              </Link>
            </div>

            <div className="wishlist-actions">
              <strong>{formatPrice(item.price)} ₫</strong>

              <button
                className="wishlist-cart-btn"
                onClick={() => addToCartHandler(item)}
              >
                Add To Cart
              </button>

              <button
                className="wishlist-buy-btn"
                onClick={() => buyNowHandler(item)}
              >
                Buy Now
              </button>

              <button
                className="wishlist-remove-btn"
                onClick={() => dispatch(removeFromWishlist(item.product))}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;