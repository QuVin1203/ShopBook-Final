import React from "react";
import { Route } from "react-router-dom";

import Home from "../Home";
import ProductDetails from "../product/ProductDetails.jsx";

import Login from "../auth/Login.jsx";
import ResetPassword from "../auth/ResetPassword";
import Register from "../auth/Register.jsx";
import ForgotPassword from "../auth/ForgotPassword.jsx";
import ProtectedRouter from "../auth/ProtectedRouter.jsx";

import Profile from "../user/Profile.jsx";
import UpdateProfile from "../user/UpdateProfile.jsx";
import UploadAvatar from "../user/UploadAvatar.jsx";
import UpdatePassword from "../user/UpdatePassword.jsx";

import Cart from "../cart/Cart.jsx";
import Shipping from "../cart/Shipping.jsx";
import ConfirmOrder from "../cart/ConfirmOrder.jsx";
import PaymentMethod from "../cart/PaymentMethod.jsx";

import MyOrders from "../order/MyOrder.jsx";
import OrderDetails from "../order/OrderDetails.jsx";
import Invoice from "../invoice/invoice.jsx";

import Vouchers from "../voucher/Vouchers.jsx";

import TopDeals from "../product/TopDeals.jsx";
import FlashSale from "../product/FlashSale.jsx";
import BestSeller from "../product/BestSeller.jsx";
import Wishlist from "../wishlist/Wishlist.jsx";
import BankTransfer from "../cart/BankTransfer.jsx";
const userRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />

      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/login" element={<Login />} />

      <Route
  path="/password/reset/:token"
  element={<ResetPassword />}
/>

      <Route path="/register" element={<Register />} />

      <Route path="/password/forgot" element={<ForgotPassword />} />

      <Route path="/vouchers" element={<Vouchers />} />

      <Route path="/top-deals" element={<TopDeals />} />
<Route path="/flash-sale" element={<FlashSale />} />
<Route path="/best-seller" element={<BestSeller />} />
<Route
  path="/wishlist"
  element={<Wishlist />}
/>

      <Route
        path="/me/profile"
        element={
          <ProtectedRouter>
            <Profile />
          </ProtectedRouter>
        }
      />

      <Route
        path="/me/update_profile"
        element={
          <ProtectedRouter>
            <UpdateProfile />
          </ProtectedRouter>
        }
      />

      <Route
        path="/me/upload_avatar"
        element={
          <ProtectedRouter>
            <UploadAvatar />
          </ProtectedRouter>
        }
      />

      <Route
        path="/me/update_password"
        element={
          <ProtectedRouter>
            <UpdatePassword />
          </ProtectedRouter>
        }
      />

      <Route path="/cart" element={<Cart />} />

      <Route
        path="/shipping"
        element={
          <ProtectedRouter>
            <Shipping />
          </ProtectedRouter>
        }
      />

      <Route
        path="/confirm_order"
        element={
          <ProtectedRouter>
            <ConfirmOrder />
          </ProtectedRouter>
        }
      />

      <Route
        path="/payment_method"
        element={
          <ProtectedRouter>
            <PaymentMethod />
          </ProtectedRouter>
        }
      />
      <Route
  path="/bank-transfer"
  element={
    <ProtectedRouter>
      <BankTransfer />
    </ProtectedRouter>
  }
/>

      <Route
        path="/me/orders"
        element={
          <ProtectedRouter>
            <MyOrders />
          </ProtectedRouter>
        }
      />

      <Route
        path="/me/order/:id"
        element={
          <ProtectedRouter>
            <OrderDetails />
          </ProtectedRouter>
        }
      />

      <Route
        path="/invoice/order/:id"
        element={
          <ProtectedRouter>
            <Invoice />
          </ProtectedRouter>
        }
      />
      
    </>
  );
};

export default userRoutes;