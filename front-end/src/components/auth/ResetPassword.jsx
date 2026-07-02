import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../redux/api/userApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await resetPassword({
        token,
        password,
      }).unwrap();

      toast.success("Password updated successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body p-5"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4 text-center">
            Reset Password
          </h2>

          <div className="mb-3">
            <label
              htmlFor="password_field"
              className="form-label"
            >
              New Password
            </label>

            <input
              type="password"
              id="password_field"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="btn w-100 py-2"
            id="reset_password_button"
            disabled={isLoading}
          >
            {isLoading
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;