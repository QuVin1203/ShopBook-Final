import React, { useEffect, useState } from "react";
import { countries } from "countries-list";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { saveShippingInfo } from "../../redux/features/cartSlice";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countriesList = Object.values(countries);

  const { shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [country, setCountry] = useState("Vietnam");

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address || "");
      setCity(shippingInfo?.city || "");
      setPhoneNo(shippingInfo?.phoneNo || "");
      setCountry(shippingInfo?.country || "Vietnam");
    }
  }, [shippingInfo]);

  const submitHandle = (e) => {
    e.preventDefault();

    if (user?.role === "admin") {
      toast.error("Admin cannot place orders");
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNo,
        country,
        zipCode: "N/A",
      })
    );

    navigate("/confirm_order");
  };

  return (
    <>
      <CheckoutSteps Shipping />

      <div className="shipping-page">
        <div className="shipping-card">
          <div className="shipping-header">
            <span>Delivery Address</span>
            <h2>Shipping Information</h2>
            <p>Please enter your delivery details.</p>
          </div>

          <form onSubmit={submitHandle}>
            <div className="shipping-form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="city_field">City / Province</label>
              <input
                type="text"
                id="city_field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Example: Ho Chi Minh City"
                required
              />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="phone_field">Phone Number</label>
              <input
                type="tel"
                id="phone_field"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countriesList?.map((country) => (
                  <option key={country?.name} value={country?.name}>
                    {country?.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="shipping-submit-btn">
              Continue to Confirm Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;