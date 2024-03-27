import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import placeholderImage from '../../../pics/placeholder.jpg';
import { useSelector } from 'react-redux';

const AdminHeader = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
   const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/admin/profile');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <nav className="space-x-4">
        
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
