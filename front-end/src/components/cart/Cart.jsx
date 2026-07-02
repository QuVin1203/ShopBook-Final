import React from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCartItem, removeCartItem } from "../../redux/features/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("vi-VN")} đ`;
  };

  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;
    if (newQty > item?.stock) return;

    setItemToCart(item, newQty);
  };

  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;

    setItemToCart(item, newQty);
  };

  const setItemToCart = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Cart updated");
  };

  const removeCartItemHandler = (id) => {
    dispatch(removeCartItem(id));
    toast.success("Item removed from cart");
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  const totalQuantity = cartItems?.reduce(
    (acc, item) => acc + Number(item?.quantity || 0),
    0
  );

  const totalPrice = cartItems?.reduce(
    (acc, item) =>
      acc + Number(item?.quantity || 0) * Number(item?.price || 0),
    0
  );

  return (
    <>
      <MetaData title="Your Cart" />

      <div className="cart-page">
        {cartItems?.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>

            <Link to="/" className="btn empty-cart-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <h2 className="cart-title">
              Your Cart <span>({cartItems?.length} items)</span>
            </h2>

            <div className="row g-4">
              <div className="col-12 col-lg-8">
                {cartItems?.map((item) => (
                  <div key={item?.product} className="cart-product-card">
                    <div className="cart-product-img">
                      <img src={item?.image} alt={item?.name} />
                    </div>

                    <div className="cart-product-info">
                      <Link
                        to={`/product/${item?.product}`}
                        className="cart-product-name"
                      >
                        {item?.name}
                      </Link>

                      <p className="cart-product-stock">
                        Stock: {item?.stock}
                      </p>
                    </div>

                    <div className="cart-product-price">
                      {formatPrice(item?.price)}
                    </div>

                    <div className="cart-quantity-box">
                      <button
                        className="cart-qty-btn minus"
                        onClick={() => decreaseQty(item, item.quantity)}
                      >
                        -
                      </button>

                      <input type="number" value={item?.quantity} readOnly />

                      <button
                        className="cart-qty-btn plus"
                        onClick={() => increaseQty(item, item.quantity)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeCartItemHandler(item?.product)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="col-12 col-lg-4">
                <div className="cart-summary-card">
                  <h4>Order Summary</h4>

                  <div className="summary-row">
                    <span>Quantity</span>
                    <strong>{totalQuantity} units</strong>
                  </div>

                  <div className="summary-row">
                    <span>Total price</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>

                  <button
                    className="cart-checkout-btn"
                    onClick={checkoutHandler}
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;