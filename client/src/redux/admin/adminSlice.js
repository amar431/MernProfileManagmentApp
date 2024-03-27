import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAdminAuthenticated: false,
    currentAdmin: null,
    adminProfilePictureUrl: '',
    adminProfile: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminAuthSuccess: (state, action) => {
            state.isAdminAuthenticated = true;
            state.currentAdmin = action.payload;
        },
        adminAuthFailure: (state) => {
            state.isAdminAuthenticated = false;
            state.currentAdmin = null;
            state.adminProfilePictureUrl = '';
            state.adminProfile = null;
        },
        updateAdminProfilePictureUrl: (state, action) => {
            state.adminProfilePictureUrl = action.payload;
        },
        setAdminProfile: (state, action) => {
            state.adminProfile = action.payload;
        },
    },
});

export const { adminAuthSuccess, adminAuthFailure, updateAdminProfilePictureUrl, setAdminProfile } = adminSlice.actions;
export default adminSlice.reducer;
