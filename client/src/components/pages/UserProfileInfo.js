import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserProfile } from '../../redux/user/userSlice';

function UserProfileForm() {
  const {userProfile} = useSelector(state => state.user);
  const [firstname, setFirstName] = useState(userProfile ? userProfile.firstname : '');
  const [lastname, setLastName] = useState(userProfile ? userProfile.lastname : '');
  const [email, setEmail] = useState(userProfile ? userProfile.email : '');
  const [initialProfile, setInitialProfile] = useState(userProfile);
  const dispatch = useDispatch();



  const handleProfileUpdate = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.put('/api/v1/auth/profile', { firstname, lastname, email });
        console.log('Profile updated successfully:', response.data);
        const updatedProfile = {
          ...initialProfile,
          firstname: firstname !== '' ? firstname : initialProfile.firstname,
          lastname: lastname !== '' ? lastname : initialProfile.lastname,
          email: email !== '' ? email : initialProfile.email
        };
        dispatch(setUserProfile(updatedProfile));
        toast.success("Details Updated Successfully")
        
        // Optionally, you can show a success message or redirect the user after successful update
      } catch (error) {
        console.error('Error updating profile:', error.response.data.message);
        // Optionally, you can show an error message to the user
        toast.error("Error in Updating Details")

      }
    };

  return (
    <div className="user-info mb-8">
      <form onSubmit={handleProfileUpdate}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-2">First Name:</label>
          <input
            type="text"
            id="firstName"
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2">Last Name:</label>
          <input
            type="text"
            id="lastName"
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default UserProfileForm;
