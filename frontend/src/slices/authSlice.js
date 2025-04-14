import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { userInfo: null, accessToken: null, openLogin:false },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user;
      state.accessToken = action.payload.token;
    },
    authlogout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
    },
    showLogin: (state, action) => {
      state.openLogin = action.payload;
      
    },
  },
});

export const { setCredentials, authlogout,showLogin } = authSlice.actions;
export default authSlice.reducer;
