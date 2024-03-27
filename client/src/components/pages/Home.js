import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  authSuccess,
  authFailure,
  updateProfilePictureUrl,
} from "../../redux/user/userSlice";
import axios from "axios";
import Header from "../header/Header";

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get("/api/v1/pictures");
        const primaryProfilePicture = response.data.find(
          (picture) => picture.isPrimary
        );
        if (primaryProfilePicture) {
          dispatch(updateProfilePictureUrl(primaryProfilePicture.url)); // Dispatching the action here
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();

    axios
      .get("/api/v1/auth/home/", { withCredentials: true })
      .then((response) => {
        if (response.data.authenticated) {
          console.log("user is authenticated");
          dispatch(authSuccess(true));
        }
      })
      .catch((error) => {
        dispatch(authFailure(false));
        console.error("Error not authenticated:", error);
      });
  }, [dispatch]);

  return (
    <>
    <Header />
    <div className="container mx-auto mt-8">
      {isAuthenticated ? (
        <div>
          <p>Welcome,{userProfile?.firstname}!</p>
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            To take the quiz, please log in or register.
          </p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
          <span className="text-gray-500 mx-2">or</span>
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
