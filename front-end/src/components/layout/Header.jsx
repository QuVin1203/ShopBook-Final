import React from "react";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../../redux/api/authApi";
import Search from "./Search";

const Header = () => {
  const navigate = useNavigate();

  const { isLoading } = useGetMeQuery();
  const [logout] = useLazyLogoutQuery();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const isAdmin = user?.role === "admin";

  const logoutHandler = async () => {
  try {
    await logout().unwrap();
    navigate("/");
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};
  return (
    <>
      <nav className="navbar row">
        {/* Logo */}
        <div className="col-12 col-md-3 ps-4">
          <div className="navbar-brand">
            <Link to="/" className="logo-container">
              <i className="fa-solid fa-book-open logo-book"></i>

              <span className="logo-text">SHOPBOOK</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>

        {/* Right menu */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {!isAdmin && (
            <>
              <Link to="/cart" style={{ textDecoration: "none" }}>
                <span id="cart" className="ms-3">
                  Cart
                </span>

                <span className="ms-1" id="cart_count">
                  {cartItems?.length || 0}
                </span>
              </Link>

              <Link
                to="/wishlist"
                className="ms-3 text-white"
                style={{ textDecoration: "none" }}
              >
                ❤️

                <span className="ms-1" id="wishlist_count">
                  {wishlistItems?.length || 0}
                </span>
              </Link>
            </>
          )}

          {user ? (
            <div className="ms-4 dropdown d-inline-block">
              <button
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user?.avatar}
                    alt="User Avatar"
                    className="rounded-circle"
                  />
                </figure>

                <span className="ms-2">{user?.name}</span>
              </button>

              <div
                className="dropdown-menu w-100"
                aria-labelledby="dropDownMenuButton"
              >
                {isAdmin && (
                  <Link
                    className="dropdown-item"
                    to="/admin/dashboard"
                  >
                    Dashboard
                  </Link>
                )}

                {!isAdmin && (
                  <>
                    <Link
                      className="dropdown-item"
                      to="/me/orders"
                    >
                      Orders
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/wishlist"
                    >
                      Wishlist
                    </Link>
                  </>
                )}

                <Link
                  className="dropdown-item"
                  to="/me/profile"
                >
                  Profile
                </Link>

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="d-inline-flex ms-4">
                <Link
                  to="/login"
                  className="btn btn-outline-light me-2"
                  id="login_btn"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-light"
                  id="register_btn"
                >
                  Register
                </Link>
              </div>
            )
          )}
        </div>
      </nav>

      {/* Category menu */}
      <div className="header-category-menu">
        <Link to="/flash-sale">🔥 Book Sale</Link>
        
        
        <Link to="/vouchers">🎁 Hot Coupon</Link>
        <Link to="/best-seller">🏆 Best Seller</Link>
        
      </div>
    </>
  );
};

export default Header;