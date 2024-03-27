import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';

function Register() {
  const [lastname, setLastName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

 
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setError([])
    const userData = {
      firstname,
      lastname,
      email,
      password,
    };
    try {
      const response = await axios.post('/api/v1/auth/register', userData);
      console.log('Registration successful:', response.data);
      toast.success('Registration successful.');
      setSuccessMessage('Registration successful. Please check your email to verify your account before logging in.');
      setFirstname('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error.response.data)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
    } 
    
    else if (error.response && error.response.data && error.response.data.errors) { //validation errors
        const errorData = error.response.data.errors;
        setError(errorData);
        toast.error(error.response.data.message);
      } else {
        setError([]);
        toast.error('Technical failure occurred. Please try again later or contact support.');
      }
    }
  };

  return (
    <>
    <Header />
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form>
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            {error.map((errorItem, index) => (
              errorItem.path === 'firstname' && (
                <div className="text-red-500 mb-2" key={index}>
                  {errorItem.msg}
                </div>
              )
            ))}
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
            {error.map((errorItem, index) => (
              errorItem.path === 'lastname' && (
                <div className="text-red-500 mb-2" key={index}>
                  {errorItem.msg}
                </div>
              )
            ))}
          </div>
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
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
