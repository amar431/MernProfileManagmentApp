 import mongoose from 'mongoose'


 const addressSchema = new mongoose.Schema({
    address: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  });
  const profilePictureSchema = new mongoose.Schema({
    url: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  });
  


 const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    addresses: [addressSchema],
    profilePictures: [profilePictureSchema],
    activationToken: String,
    customToken: {
      type:String,
    default:null},
    active: {
        type: Boolean,
        default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
  },
  loggedIn: {
    type: Boolean,
    default: false
} 
 },{timestamps:true})

 export default mongoose.model('users',userSchema)