import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';


const AddUserForm = ({ onClose }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "user", // Default role is "user"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to create a new user with formData
      const response = await axios.post(`/api/v1/admin/register`, formData);
      toast.success('Registration successful.');
      setSuccessMessage('Registration successful. Please check your email to verify your account before logging in.');
      console.log("New user created:", response.data);

      // Close the form after successful submission
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleClose = () => {
    onClose(); // Call onClose function provided by parent component
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-full md:w-3/4 max-w-md rounded-lg shadow-md p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
          style={{ top: "8rem", right: "29rem" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="6" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="14" x2="14" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          <div className="mb-4">
            <label htmlFor="firstname" className="block font-medium mb-1">
              First Name:
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block font-medium mb-1">
              Last Name:
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block font-medium mb-1">
              Role:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
