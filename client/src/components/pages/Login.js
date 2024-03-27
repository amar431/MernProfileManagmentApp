import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../header/Header';

import { authSuccess,setUserProfile } from '../../redux/user/userSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state)=>state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async(e) => {
    e.preventDefault();
    setError([]); // Reset errors before making a new request

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('/api/v1/auth/login', userData);
      console.log('Login successful:', response.data);
      dispatch(setUserProfile(response.data))
      toast.success('Login successful.');
      localStorage.setItem('token', response.data.token);
      dispatch(authSuccess(true));
      navigate('/');

    } catch (error) {
      console.log(error.response.data.message,"this is error")
     
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
    }
      else if (error.response && error.response.data && error.response.data.errors) {
        const errorData = error.response.data.errors;
        setError(errorData);
      }else{
        setError([]);
        toast.error('Login failed.');
      }
    }
  };

  return (
    <>
     <Header/> 
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
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

export default Login;
