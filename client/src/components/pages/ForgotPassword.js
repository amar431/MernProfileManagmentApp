// ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../header/Header";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError([]);
    try {
      await axios.post("/api/v1/auth/forgetPassword", { email });
      toast.success(
        "An email with password reset instructions has been sent to your inbox."
      );
    } catch (error) {
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
        setError(errorData);
      } else {
        toast.error("Reset Password failed.");
      }
    }
  };

  return (
    <>
    <Header />
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.map(
              (errorItem, index) =>
                errorItem.path === "email" && (
                  <div className="text-red-500 mb-2" key={index}>
                    {errorItem.msg}
                  </div>
                )
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default ForgotPassword;
