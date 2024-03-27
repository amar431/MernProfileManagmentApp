// ProfilePage.js

import React, { useState } from 'react';
import AddressManagement from './AddressManagement';
import UserProfileForm from './UserProfileInfo';
import ProfilePictureManagment from './ProfilePictureManagement';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../header/Header';

function ProfilePage() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState('personalInfo');
  const navigate = useNavigate()

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  if (!isAuthenticated) {
    navigate('/login')
  }

console.log(isAuthenticated)
  return (
    <>
    <Header />
    <div className="profile-page flex">
      {/* Sidebar */}
      <div className="sidebar bg-gray-200 p-4 w-1/4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-4">Profile Information Update</h3>
          <ul>
            <li
              className={`py-2 px-4 hover:bg-gray-300 cursor-pointer ${
                selectedTab === 'personalInfo' ? 'bg-gray-300 font-bold' : ''
              }`}
              onClick={() => handleTabClick('personalInfo')}
            >
              Personal Info
            </li>
            <li
              className={`py-2 px-4 hover:bg-gray-300 cursor-pointer ${
                selectedTab === 'address' ? 'bg-gray-300 font-bold' : ''
              }`}
              onClick={() => handleTabClick('address')}
            >
              Manage Address
            </li>
          </ul>
        </div>
        {/* Logout Button */}
        <div>
          <Logout />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content px-4 py-4 w-3/4">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        {/* Profile Picture */}
        {selectedTab === 'personalInfo' && <ProfilePictureManagment />}

        {/* User Information */}
        {selectedTab === 'personalInfo' && <UserProfileForm />}

        {/* Address Management */}
        {selectedTab === 'address' && <AddressManagement />}
      </div>
    </div>
    </>
  );
}

export default ProfilePage;
