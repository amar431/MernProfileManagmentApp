 import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useAdminAuth = () => {
  const navigate = useNavigate()
    const isAdminAuthenticated = useSelector(state => state.user.isAdminAuthenticated);
    
    useEffect(() => {
      if (!isAdminAuthenticated) {
        navigate('/login');
      }
    }, [isAdminAuthenticated]);
  
    return isAdminAuthenticated;
  };
  
  
  export default useAdminAuth;
  