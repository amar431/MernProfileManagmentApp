/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import placeholderImage from '../../pics/placeholder.jpg';
import { useSelector } from 'react-redux';


function Header() {
 
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const primaryProfilePictureUrl = useSelector(state => state.user.profilePictureUrl);
  const naviagate = useNavigate()


  const handleProfileClick = () => {
    if (isAuthenticated) {
     naviagate('/profile')
    } else {
      naviagate('/login')
    }
  };


  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold"><Link to='/'>Profile Management</Link> </h1>
        <nav className="space-x-4">
        {isAuthenticated && primaryProfilePictureUrl ? (
            <Link to="/profile">
              <img src={primaryProfilePictureUrl} onClick={handleProfileClick} alt="Profile" className="h-10 w-10 rounded-full" />
            </Link>
          ) : (
            isAuthenticated && (
              <Link to="/profile">
                <img src={placeholderImage} alt="Profile" className="h-10 w-10 rounded-full" />
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
