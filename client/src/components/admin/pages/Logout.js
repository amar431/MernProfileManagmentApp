import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { adminAuthFailure } from "../../../redux/admin/adminSlice";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.admin?.adminProfile?._id);

  // Assuming you have stored the user ID in your Redux store
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/admin/logout", { userId });
      dispatch(adminAuthFailure());
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
