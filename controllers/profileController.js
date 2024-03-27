// profileController.js

import userModel from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';

export const updateProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming you are using authentication middleware to get the user ID
        
        const { firstname, lastname, email} = req.body;

        // Update user's first name, last name, and email
        const user = await userModel.findById(userId);

        // Update user's profile with provided fields
        if (firstname !== undefined && firstname !== '') {
            user.firstname = firstname;
        }
        if (lastname !== undefined && lastname !== '') {
            user.lastname = lastname;
        }
        if (email !== undefined && email !== '') {
            user.email = email;
        }

        // Save updated profile to the database
        await user.save();

        // Update addresses
        // if (addresses) {
        //     // Check if more than one primary address exists
        //     const primaryAddressCount = addresses.filter(addr => addr.isPrimary).length;
        //     if (primaryAddressCount > 1) {
        //         return next(errorHandler(400, 'Cannot have more than one primary address'));
        //     }

        //     // Update user's addresses
        //     await userModel.findByIdAndUpdate(userId, { addresses });
        // }

        // Update profile pictures
        // if (profilePictures) {
        //     // Check if more than one primary picture exists
        //     const primaryPictureCount = profilePictures.filter(pic => pic.isPrimary).length;
        //     if (primaryPictureCount > 1) {
        //         return next(errorHandler(400, 'Cannot have more than one primary picture'));
        //     }

        //     // Update user's profile pictures
        //     await userModel.findByIdAndUpdate(userId, { profilePictures });
        // }

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};
