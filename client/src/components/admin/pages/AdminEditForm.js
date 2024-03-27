import React, { useState, useEffect } from "react";
import axios from 'axios'

const AdminEditForm = ({ user, onClose, profilePicture }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Populate form data with user details when component mounts
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compare the form data with the user's original data
    const updatedData = {};
    for (const key in formData) {
      if (formData[key] !== user[key]) {
        updatedData[key] = formData[key];
      }
    }

    updatedData.userId = user._id; 
    console.log(updatedData.userId)

    // Submit the updated data to the backend
    try {
      // Make an API call to update user data with updatedData
      const response = await axios.put(`/api/v1/admin/users`, updatedData);
      console.log("Updated data:", response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleClose = () => {
    onClose(); // Call onClose function provided by parent component
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-full md:w-3/4 max-w-3xl rounded-lg shadow-md p-6">
        <button
          onClick={handleClose}
          className="absolute top-16 right-80 text-black hover:text-gray-700 focus:outline-none"
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
        <div className="flex justify-center">
  {profilePicture ? (
    <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
  ) : (
    <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-16 h-16 text-gray-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
  )}
</div>
        <form onSubmit={handleSubmit}>
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
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
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
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
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
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
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
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditForm;
