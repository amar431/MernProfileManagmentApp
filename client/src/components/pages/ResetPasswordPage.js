import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../header/Header";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);

    try {
      const response = await axios.post(
        `/api/v1/auth/reset-password/${token}`,
        { newPassword, confirmPassword }
      );
      setSuccessMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        const errorData = error.response.data.errors;
        console.log(errorData);
        setError(errorData);
      } else {
        toast.error("Reset Password failed.");
      }
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border"
            />
            {error.map(
              (errorItem, index) =>
                errorItem.path === "newPassword" && ( // Corrected field name here
                  <div className="text-red-500 mb-2" key={index}>
                    {errorItem.msg}
                  </div>
                )
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border"
            />
            {error.map(
              (errorItem, index) =>
                errorItem.path === "confirmPassword" && (
                  <div className="text-red-500 mb-2" key={index}>
                    {errorItem.msg}
                  </div>
                )
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
      </div>
    </div>
    </>
  );
};

export default ResetPasswordPage;
