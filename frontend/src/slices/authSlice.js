// import { createSlice } from '@reduxjs/toolkit';

// // Initialize state from localStorage if available
// const initialState = {
//   userInfo: localStorage.getItem('userInfo') 
//     ? JSON.parse(localStorage.getItem('userInfo'))
//     : null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload;
//       localStorage.setItem('userInfo', JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.userInfo = null;
//       localStorage.removeItem('userInfo');
//     },
//     updateUserInfo: (state, action) => {
//       state.userInfo = { ...state.userInfo, ...action.payload };
//       localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
//     },
//     showLogin: (state, action) => {
//       state.openLogin = action.payload;
      
//     },
//   },
// });

// export const { setCredentials, logout, updateUserInfo ,showLogin} = authSlice.actions;

// // Selector for current token
// export const selectCurentToken = (state) => state.auth.accessToken;

// export default authSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice'; // Make sure the path is correct

// Initialize state from localStorage if available
const initialState = {
  userInfo: localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    showLogin: (state, action) => {
      state.openLogin = action.payload;
    },
    // Just a dummy reducer to allow logout thunk below
    clearUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

// Thunk action to reset RTK Query cache and logout
export const logout = () => (dispatch) => {
  dispatch(authSlice.actions.clearUserInfo());
  dispatch(apiSlice.util.resetApiState()); // 🔥 clears all cached queries including profile
};

export const { setCredentials, updateUserInfo, showLogin } = authSlice.actions;

// Selector for current token
export const selectCurentToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
