// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import AdminHeader from '../adminheader/AdminHeader';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import {  adminAuthFailure } from '../../../redux/admin/adminSlice';
import io from 'socket.io-client'; 


const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminAuthenticated = useSelector(state => state.admin.isAdminAuthenticated);
   const [users, setUsers] = useState([]);
 
  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/admin/users');
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401){
          dispatch(adminAuthFailure()); // Dispatch adminAuthFailure action
        }
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    
  }, [isAdminAuthenticated,dispatch]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    console.log('useEffect for socket connection is triggered'); // Debug logging
    const socket = io('http://localhost:3000'); // Replace with your server URL
    console.log("socket",socket)

    // Listen for 'userStatusUpdate' event and update user status
    socket.on('userStatusUpdate', ({ userId, status }) => {
      console.log('Received user status update:', { userId, status }); // Log the status received from the backend
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, loggedIn: status } : user
        )
      );
      const updatedUser = users.find(user => user._id === userId);
      console.log('Updated user status:', updatedUser);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  return (
    <>
      <AdminHeader />
      <UserList users={users} />
    </>
  );
};

export default AdminDashboard;
