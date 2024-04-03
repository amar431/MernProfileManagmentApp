import React, { useState, useEffect } from "react";
import AdminHeader from "../adminheader/AdminHeader";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import { adminAuthFailure } from "../../../redux/admin/adminSlice";
import io from "socket.io-client";
import AddUserForm from "./AddUserForm"; // Import the AddUserForm component
import Logout from "./Logout";

const AdminDashboard = () => {
  // Define states and selectors
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminAuthenticated = useSelector(
    (state) => state.admin.isAdminAuthenticated
  );
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to control AddUserForm visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/admin/users");
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(adminAuthFailure()); // Dispatch adminAuthFailure action
        }
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isAdminAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    console.log("useEffect for socket connection is triggered"); // Debug logging
    const socket = io("http://localhost:3000"); // Replace with your server URL
    console.log("socket", socket);

    // Listen for 'userStatusUpdate' event and update user status
    socket.on("userStatusUpdate", ({ userId, status }) => {
      console.log("Received user status update:", { userId, status }); // Log the status received from the backend
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, loggedIn: status } : user
        )
      );
      const updatedUser = users.find((user) => user._id === userId);
      console.log("Updated user status:", updatedUser);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate the index of the last user on the current page
  const indexOfLastUser = currentPage * usersPerPage;

  // Calculate the index of the first user on the current page
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Slice the users array to display only the users for the current page
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Create a function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <AdminHeader />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <ul className="space-y-2">
            {/* Add User tab */}
            <li>
              <button
                className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-300"
                onClick={() => setShowAddUserForm(true)} // Show AddUserForm when clicked
              >
                Add User
              </button>
            </li>
            <li className="py-60 px-3">
              <Logout /> {/* Render the Logout component */}
            </li>
            {/* Add more sidebar options as needed */}
          </ul>
        </div>
        {/* Main Content */}
        <div className="w-3/4 p-4">
          {showAddUserForm && (
            <AddUserForm onClose={() => setShowAddUserForm(false)} />
          )}
          {/* Render AddUserForm when showAddUserForm is true */}
          <UserList users={currentUsers} />
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 border ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
