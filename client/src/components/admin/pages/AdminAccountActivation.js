import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AdminHeader from "../adminheader/AdminHeader";
import { useParams } from 'react-router-dom';

const AdminAccountActivation = () => {
    const [message, setMessage] = useState('');
    const { activationToken } = useParams();

    useEffect(() => {
        const activateAccount = async () => {
          try {
            const response = await axios.get(`/api/v1/admin/login/activate/${activationToken}`);
            setMessage(response.data.message);
          } catch (error) {
            setMessage(error.response.data.message);
          }
        };
    
        activateAccount();
      }, [activationToken]);
  return (
    <>
    <AdminHeader />
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Account Activation</h2>
        <p>{message}</p>
      </div>
    </div>
    </>
  );
}

export default AdminAccountActivation