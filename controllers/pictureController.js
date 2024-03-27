import User from '../models/userModel.js';
import path from 'path';

export const getAllPictures = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const profilePictures = user.profilePictures;
    res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const addProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedPictures = [];
    req.files.forEach(file => {
      const url = req.protocol + '://' + req.get('host') + '/uploads/' + file.filename;
      
      uploadedPictures.push({ url, isPrimary: false }); // Assuming all uploaded pictures are not primary by default      // const newProfilePicture = new ProfilePicture({ url });
      // await newProfilePicture.save();
    });

    user.profilePictures.push(...uploadedPictures);

    await user.save();

    res.status(201).json({ message: 'Profile pictures uploaded successfully.',uploadedPictures});
  } catch (error) {
    console.error('Error adding profile picture:', error);
    res.status(500).json({ error: 'Failed to add profile picture.' });
  }
};


// Controller function to set a profile picture as primary for a user
export const setPrimaryProfilePicture = async (req, res) => {
  try {
    const { pictureId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const picture = user.profilePictures.id(pictureId);
    if (!picture) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }
    user.profilePictures.forEach(pic => {
      pic.isPrimary = pic._id.toString() === pictureId;
    });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error setting primary profile picture:', error);
    res.status(500).json({ error: 'Failed to set primary profile picture' });
  }
};

export const deleteProfilePicture = async (req, res) => {
  const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  const { pictureId } = req.params;

  try {
   

    const pictureIndex = user.profilePictures.findIndex(picture => picture._id == pictureId);

    if (pictureIndex === -1) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    // Check if the picture to be deleted is the primary one
    if (user.profilePictures[pictureIndex].isPrimary) {
      return res.status(400).json({ message: 'Primary profile picture cannot be deleted' });
    }

    // Remove the picture from the array
    user.profilePictures.splice(pictureIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};