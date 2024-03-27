/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateProfilePictureUrl } from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePictureManagement = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [primaryProfilePictureUrl, setPrimaryProfilePictureUrl] = useState("");
  const fetchPictures = async () => {
    try {
      const response = await axios.get("/api/v1/pictures");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching pictures:", error);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  useEffect(() => {
    // Find the index of the primary picture
    const primaryIndex = images.findIndex((picture) => picture.isPrimary);
    setPrimaryIndex(primaryIndex);
     setPrimaryProfilePictureUrl(images[primaryIndex]?.url);
  }, [images]);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (images.length < 3) {
      setSelectedImage(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("profilePictures", selectedImage);

    try {
      const response = await axios.post("/api/v1/pictures", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedPictures = response.data.uploadedPictures;
      setImages((prevImages) => [...prevImages, ...uploadedPictures]);

      fetchPictures();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("adding Profile picture failed.");
      }
    }
  };

  const handleImageDelete = async (index, pictureId) => {
    console.log("Deleting picture with ID:", pictureId);
    if (index === primaryIndex) {
      return; // Prevent deleting primary image
    }

    try {
      await axios.delete(`/api/v1/pictures/${pictureId}`);

      fetchPictures();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Profile picture delete failed.");
      }
    }
  };

  const handlePrimaryToggle = async (index, pictureId) => {
    setPrimaryIndex(index);
    try {
      await axios.put(`/api/v1/pictures/${pictureId}/set-primary`);
      dispatch(updateProfilePictureUrl(images[index]?.url));
      fetchPictures();
      toast.success("Updated Profile Picture");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("primary Profile picture update failed.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <input
        type="file"
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md mb-4 inline-flex items-center"
      >
        Add Image
      </label>
      <div className="flex flex-wrap justify-center">
        {selectedImageUrl && images.length < 3 && (
          <div className="flex flex-col items-center mr-4 mb-4">
            <img
              src={selectedImageUrl}
              alt="Selected Image"
              className="w-32 h-32 rounded-lg mb-2"
            />
            <button
              onClick={handleImageUpload}
              className="bg-blue-500 text-white px-3 py-1 rounded-md mb-2"
            >
              Upload
            </button>
          </div>
        )}
        {images.map((profilePictures, index) => (
          <div key={index} className="flex flex-col items-center mr-4 mb-4">
            <img
              src={profilePictures.url}
              alt={`Image ${index}`}
              className="w-32 h-32 rounded-lg mb-2"
            />
            <div className="flex">
              <button
                onClick={() => handleImageDelete(index, profilePictures?._id)}
                className={`bg-red-500 text-white px-3 py-1 rounded-md mr-2 ${
                  index === primaryIndex ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={index === primaryIndex}
              >
                Delete
              </button>
              <button
                onClick={() => handlePrimaryToggle(index, profilePictures?._id)}
                className={`px-3 py-1 rounded-md ${
                  index === primaryIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-gray-200"
                }`}
              >
                {index === primaryIndex ? "Primary" : "Set Primary"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* {primaryIndex !== null && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Primary Profile Picture</h2>
          <img
            src={images[primaryIndex]?.url}
            alt="Primary Profile"
            className="w-32 h-32 rounded-lg"
          />
        </div>
      )} */}
    </div>
  );
};

export default ProfilePictureManagement;
