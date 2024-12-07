import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
  token: null,
  status: 'idle',
  error: null,
};

// Create an async thunk for the login request
export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await axios.post('http://localhost:8080/realms/pisval-pos-realm/protocol/openid-connect/token', {
    client_id: 'pos-backend',
    client_secret: 'nyAAjg2U97oxLxJKcxDhVaOFSNZYhfb7',
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
});

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;