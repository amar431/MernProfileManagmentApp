import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import useRequireAuth from './useAuth';

const ProtectRoute = ({ element, ...rest }) => {
    const isAuthenticated = useRequireAuth();
  
    return isAuthenticated ? <Outlet {...rest} element={element} /> : <Navigate to="/login" />;
  };
  

  export default ProtectRoute
