import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import toast from "react-hot-toast";

import {
  useGetAdminVouchersQuery,
  useCreateVoucherMutation,
  useDeleteVoucherMutation,
} from "../../redux/api/voucherApi";

const AdminVouchers = () => {
  const { data, refetch } = useGetAdminVouchersQuery();

  const [createVoucher, { isLoading: isCreating }] =
    useCreateVoucherMutation();

  const [deleteVoucher, { isLoading: isDeleting }] =
    useDeleteVoucherMutation();

  const [formData, setFormData] = useState({
  code: "",
  voucherType: "DISCOUNT",
  discountPercent: "",
  fixedDiscountAmount: "",
  minOrderAmount: "",
  
  quantity: "",
});

  const {
  code,
  voucherType,
  discountPercent,
  fixedDiscountAmount,
  minOrderAmount,
  
  quantity,
} = formData;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!code || !minOrderAmount || !quantity) {
      toast.error("Please fill required voucher fields");
      return;
    }

    if (
  voucherType === "DISCOUNT" &&
  !discountPercent
) {
  toast.error("Please enter discount percent");
  return;
}
if (
  voucherType === "FIXED" &&
  !fixedDiscountAmount
) {
  toast.error("Please enter discount amount");
  return;
}
    try {
      await createVoucher({
  code,
  voucherType,

  discountPercent:
    voucherType === "DISCOUNT"
      ? Number(discountPercent || 0)
      : 0,

  fixedDiscountAmount:
    voucherType === "FIXED"
      ? Number(fixedDiscountAmount || 0)
      : 0,

  minOrderAmount: Number(minOrderAmount || 0),

  

  quantity: Number(quantity || 0),
  isActive: true,
}).unwrap();} catch (error) {
      toast.error(error?.data?.message || "Create failed");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete voucher?")) return;

    try {
      await deleteVoucher(id).unwrap();
      toast.success("Voucher deleted");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="mb-3">🎁 Voucher Management</h2>

        <form onSubmit={submitHandler} className="card p-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Code"
                value={code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <select
  className="form-select"
  value={voucherType}
  onChange={(e) =>
    setFormData({
      ...formData,
      voucherType: e.target.value,
    })
  }
>
  <option value="DISCOUNT">Discount %</option>
  <option value="FIXED">Fixed Amount</option>
  <option value="FREESHIP">Free Ship</option>
</select>
            </div>

            {voucherType === "DISCOUNT" && (
              <>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="% Discount"
                    value={discountPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercent: e.target.value,
                      })
                    }
                  />
                </div>

          
              </>
            )}
            {voucherType === "FIXED" && (
  <div className="col-md-2">
    <input
      className="form-control"
      type="number"
      placeholder="Discount Amount"
      value={fixedDiscountAmount}
      onChange={(e) =>
        setFormData({
          ...formData,
          fixedDiscountAmount: e.target.value,
        })
      }
    />
  </div>
)}

            <div className="col-md-2">
              <input
                className="form-control"
                type="number"
                placeholder="Min Order"
                value={minOrderAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrderAmount: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-success w-100"
                disabled={isCreating}
              >
                {isCreating ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>

        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Min Order</th>
              
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.vouchers?.length > 0 ? (
              data.vouchers.map((voucher) => (
                <tr key={voucher._id}>
                  <td>{voucher.code}</td>

                  <td>
  {voucher.voucherType === "DISCOUNT" && (
    <span className="badge bg-warning text-dark">
      🎁 Discount %
    </span>
  )}

  {voucher.voucherType === "FIXED" && (
    <span className="badge bg-primary">
      💵 Fixed Amount
    </span>
  )}

  {voucher.voucherType === "FREESHIP" && (
    <span className="badge bg-info text-dark">
      🚚 Free Ship
    </span>
  )}
</td>

                  <td>
  {voucher.voucherType === "DISCOUNT" &&
    `${voucher.discountPercent}%`}

  {voucher.voucherType === "FIXED" &&
    `${formatPrice(
      voucher.fixedDiscountAmount
    )} ₫`}

  {voucher.voucherType === "FREESHIP" &&
    "-"}
</td>

                  <td>{formatPrice(voucher.minOrderAmount)} ₫</td>

                  

                  <td>{voucher.quantity}</td>

                  <td>
                    {voucher.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Disabled</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteHandler(voucher._id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No vouchers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminVouchers;