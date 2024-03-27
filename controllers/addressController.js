// controllers/addressController.js

import User from '../models/userModel.js';
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

export const getAllAddress = async(req,res,next)=>{
    try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
          res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Add address to user
export const addAddress = async (req, res, next) => {
  try {
    let addresses

    const userId = req.user.id;
    const { address, isPrimary } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    addresses = user.addresses.push({ address, isPrimary });
    await user.save();
    if (!addresses) {
      // Simulate an error and trigger the email notification
      throw new Error("Failed to save address in the database");
    }

    res.status(201).json({ success: true, message: 'Address added successfully', user: user });
  } catch (error) {
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: 'backendteam@yopmail.com',
      subject: "Error: Address Saving Failure",
      html: `<h1>Error Details</h1>
             <p>Error occurred while saving address in the database:</p>
             <p>${error.message}</p>`,
    });
    next(error);
  }
};

// Set primary address for user
export const setPrimaryAddress = async (req, res, next) => {
  try {
    let addresses


    const userId = req.user.id;
    const addressId = req.params.addressId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Unset primary flag for all addresses
    user.addresses.forEach(addr => {
      addr.isPrimary = false;
    });

    // Set primary flag for selected address
    addresses = user.addresses[addressIndex].isPrimary = true;

    await user.save();

    if (!addresses) {
      // Simulate an error and trigger the email notification
      throw new Error("Failed to save address in the database");
    }

    res.status(200).json({ success: true, message: 'Primary address set successfully', user: user });
  } catch (error) {
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: 'backendteam@yopmail.com',
      subject: "Error: Address Saving Failure",
      html: `<h1>Error Details</h1>
             <p>Error occurred while saving primary address in the database:</p>
             <p>${error.message}</p>`,
    });
    next(error);
  }
};


export const deleteAddress = async (req, res, next) => {
    try {
      let addresses

      const userId = req.user.id;
      const addressId = req.params.addressId;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ success: false, message: 'Address not found' });
      }

      if (user.addresses[addressIndex].isPrimary) {
        return res.status(400).json({ success: false, message: 'Primary address cannot be deleted' });
      }
  
      // Remove address from user's addresses array
       addresses = user.addresses.splice(addressIndex, 1);
      await user.save();
      if (!addresses) {
        // Simulate an error and trigger the email notification
        throw new Error("Failed to save address in the database");
      }

  
      res.status(200).json({ success: true, message: 'Address deleted successfully', user: user });
    } catch (error) {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: 'backendteam@yopmail.com',
        subject: "Error: Address Saving Failure",
        html: `<h1>Error Details</h1>
               <p>Error occurred while deleting address in the database:</p>
               <p>${error.message}</p>`,
      });
      next(error);
    }
  };
  