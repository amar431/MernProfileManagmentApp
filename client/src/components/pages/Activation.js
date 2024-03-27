import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../header/Header';
import { useParams } from 'react-router-dom';

function Activation() {
  const [message, setMessage] = useState('');
  const { activationToken } = useParams();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/login/activate/${activationToken}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message);
      }
    };

    activateAccount();
  }, [activationToken]);

  return (
    <>
    <Header />
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Account Activation</h2>
        <p>{message}</p>
      </div>
    </div>
    </>
  );
}

export default Activation;
