import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    isAuthenticated:false,
    currentUser:null,
    profilePictureUrl: '',
    userProfile: null, 
    userStatus: 'offline'
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        authSuccess:(state,action)=>{
            state.isAuthenticated = true
            state.currentUser = action.payload; 
        },
        authFailure:(state)=>{
            state.isAuthenticated = false
            state.currentUser = null;
            state.profilePictureUrl = "";
            state.userProfile = null; // Reset userProfile on authentication failure
        },
        updateProfilePictureUrl: (state, action) => {
            state.profilePictureUrl = action.payload;
            console.log(state.profilePictureUrl)
          },
          setUserProfile: (state, action) => {
            
            state.userProfile = action.payload;
            console.log(state.userProfile)
          },
          updateUserStatus: (state, action) => {
            state.userStatus = action.payload; // Update user status
        }
    }
})
export const {authSuccess,authFailure,updateProfilePictureUrl,setUserProfile,updateUserStatus} = userSlice.actions
export default userSlice.reducer