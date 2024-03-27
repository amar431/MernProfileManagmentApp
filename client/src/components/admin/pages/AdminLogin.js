import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { adminAuthSuccess, adminAuthFailure, setAdminProfile } from '../../../redux/admin/adminSlice';
import AdminHeader from '../adminheader/AdminHeader';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogin = async (e) => { 
    e.preventDefault();
    setError([]);

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('/api/v1/admin/login', userData);
      console.log('Admin login successful:', response.data);
      dispatch(setAdminProfile(response.data)); // Set admin profile
      toast.success('Admin login successful.');
      dispatch(adminAuthSuccess(response.data)); // Dispatch admin auth success action
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error.response.data.message, "this is error");
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        const errorData = error.response.data.errors;
        setError(errorData);
      } else {
        setError([]);
        toast.error('Admin login failed.');
      }
      dispatch(adminAuthFailure()); // Dispatch admin auth failure action
    }
  };

  return (
    <>
    <AdminHeader />
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <form>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.map((errorItem, index) => (
              errorItem.path === 'email' && (
                <div className="text-red-500 mb-2" key={index}>
                  {errorItem.msg}
                </div>
              )
            ))}
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md border"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.map((errorItem, index) => (
              errorItem.path === 'password' && (
                <div className="text-red-500 mb-2" key={index}>
                  {errorItem.msg}
                </div>
              )
            ))}
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md"
            onClick={handleLogin}
          >
            Login
          </button>
          <Link to="/forgot-password" className="text-blue-500 hover:underline mb-4 block">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-blue-500 hover:underline block">
            New to the website? Register now
          </Link>
        </form>
      </div>
    </div>
    </>
  );
}

export default AdminLogin;
