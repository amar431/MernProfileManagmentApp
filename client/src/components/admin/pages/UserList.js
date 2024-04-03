import React, { useEffect, useState } from "react";
import AdminEditForm from "./AdminEditForm";
import axios from "axios";
import { toast } from "react-toastify";

const UserList = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleViewEditClick = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleCloseForm = () => {
    setShowPopup(false);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`/api/v1/admin/${userId}`);
      toast.success("Deleted User Successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      <table className="min-w-full divide-y divide-gray-200">
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
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.firstname} {user.lastname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
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
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                {user.role !== "admin" && (
                  <>
                    <button
                      onClick={() => handleViewEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:bg-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded bg-red-100 hover:bg-red-200 focus:outline-none focus:bg-red-200"
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
      {selectedUser && showPopup && (
        <AdminEditForm
          user={selectedUser}
          onClose={handleCloseForm}
          profilePicture={
            selectedUser?.profilePictures.find((pic) => pic.isPrimary)?.url
          }
        />
      )}
    </div>
  );
};

export default UserList;
