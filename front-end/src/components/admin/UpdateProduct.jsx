import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productApi";
import toast from "react-hot-toast";
import { PRODUCT_CATEGORIES } from "../../constants/constants";

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    flashSaleDiscount: "",
    category: "",
    stock: "",
    seller: "",
    isFlashSale: false,
    flashSaleStartTime: "",
    flashSaleEndTime: "",
  });

  const {
    name,
    description,
    price,
    category,
    stock,
    seller,
    discount,
    flashSaleDiscount,
    isFlashSale,
    flashSaleStartTime,
    flashSaleEndTime,
  } = product;

  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();

  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      setProduct({
        name: data?.product?.name || "",
        description: data?.product?.description || "",
        price: data?.product?.price || "",
        category: data?.product?.category || "",
        stock: data?.product?.stock || "",
        seller: data?.product?.seller || "",
        discount: data?.product?.discount || 0,
        flashSaleDiscount: data?.product?.flashSaleDiscount || 0,
        isFlashSale: data?.product?.isFlashSale || false,
        flashSaleStartTime: formatDateTimeLocal(
          data?.product?.flashSaleStartTime
        ),
        flashSaleEndTime: formatDateTimeLocal(data?.product?.flashSaleEndTime),
      });
    }

    if (error) toast.error(error?.data?.message);

    if (isSuccess) {
      toast.success("Product updated");
      navigate("/admin/product");
    }
  }, [data, error, isSuccess, navigate]);

  const onChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (isFlashSale && (!flashSaleStartTime || !flashSaleEndTime)) {
      toast.error("Please select flash sale start and end time");
      return;
    }

    updateProduct({
      id: params?.id,
      body: {
        ...product,
        price: Number(price),
        discount: Number(discount || 0),
        flashSaleDiscount: Number(flashSaleDiscount || 0),
        stock: Number(stock),
        isFlashSale,
        flashSaleStartTime: isFlashSale ? flashSaleStartTime : null,
        flashSaleEndTime: isFlashSale ? flashSaleEndTime : null,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Update Product</h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description_field" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description_field"
                rows="8"
                name="description"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="price_field" className="form-label">Price</label>
                <input
                  type="number"
                  id="price_field"
                  className="form-control"
                  name="price"
                  value={price}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="discount_field" className="form-label">
                  Discount thường (%)
                </label>
                <input
                  type="number"
                  id="discount_field"
                  className="form-control"
                  name="discount"
                  value={discount}
                  min="0"
                  max="100"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="stock_field" className="form-label">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="category_field" className="form-label">
                  Category
                </label>
                <select
                  className="form-select"
                  id="category_field"
                  name="category"
                  value={category}
                  onChange={onChange}
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORIES?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="seller_field" className="form-label">
                Seller Name
              </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={seller}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Flash Sale</label>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="flashsale_field"
                  checked={isFlashSale}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      isFlashSale: e.target.checked,
                      flashSaleStartTime: e.target.checked ? flashSaleStartTime : "",
                      flashSaleEndTime: e.target.checked ? flashSaleEndTime : "",
                      flashSaleDiscount: e.target.checked ? flashSaleDiscount : "",
                    })
                  }
                />

                <label className="form-check-label" htmlFor="flashsale_field">
                  Enable Flash Sale
                </label>
              </div>
            </div>

            {isFlashSale && (
              <>
                <div className="mb-3">
                  <label className="form-label">Flash Sale Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="flashSaleDiscount"
                    value={flashSaleDiscount}
                    min="0"
                    max="100"
                    onChange={onChange}
                    placeholder="Example: 30"
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col">
                    <label className="form-label">Flash Sale Start</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="flashSaleStartTime"
                      value={flashSaleStartTime}
                      onChange={onChange}
                    />
                  </div>

                  <div className="mb-3 col">
                    <label className="form-label">Flash Sale End</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="flashSaleEndTime"
                      value={flashSaleEndTime}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? "Updating..." : "UPDATE"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateProduct;