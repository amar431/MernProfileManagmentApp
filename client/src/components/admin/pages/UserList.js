import React, { useEffect, useState } from "react";
import AdminEditForm from "./AdminEditForm"; // Assuming EditUserForm is in the same directory
import axios from "axios"
import io from 'socket.io-client';

const UserList = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Set to false to not show the form initially
  


  // Function to handle "View/Edit" button click
  const handleViewEditClick = (user) => {
    setSelectedUser(user);
    setShowPopup(true); // Set showPopup to true when "View/Edit" button is clicked
  };
  const handleCloseForm = () => {
    setShowPopup(false); // Close the popup
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/v1/admin/${userId}`);
      console.log(response.data); // Log success message or handle accordingly
      // Assuming users array is fetched again after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table headers */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user, index) => (
  <tr key={user._id}>
    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      {user.firstname} {user.lastname}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      {/* Render admin user with a different style */}
      {user.role === "admin" ? (
        <span className="text-indigo-600 font-bold">Admin</span>
      ) : (
        <span
          className={`inline-block rounded-full px-2 py-1 ${
            user.loggedIn
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {user.loggedIn ? "Active" : "Inactive"}
        </span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {/* Handle click on "View/Edit" button */}
      {user.role !== "admin" && (
        <>
          <button
            onClick={() => handleViewEditClick(user)}
            className="text-indigo-600 hover:text-indigo-900 mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </>
      )}
    </td>
  </tr>
))}

        </tbody>
      </table>
      {/* Conditionally render EditUserForm */}
      {selectedUser && showPopup && (
        <AdminEditForm user={selectedUser} onClose={handleCloseForm} profilePicture={selectedUser?.profilePictures.find(pic => pic.isPrimary)?.url} />
      )}
    </div>
  );
};

export default UserList;
