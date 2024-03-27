import React, { useEffect } from 'react'
import {  Navigate, Outlet,useNavigate } from 'react-router-dom';
import useAdminAuth from './useAdminAuth';


const AdminProtectRoute = () => {
    // const navigate = useNavigate()
    const isAuthenticated = useAdminAuth();
    return isAuthenticated ? <Outlet />: <Navigate to = '/admin/login'/>

}

export default AdminProtectRoute