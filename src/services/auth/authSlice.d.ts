// src/services/auth/authSlice.d.ts
declare module '@services/auth/authSlice' {
    import { AsyncThunk, Slice } from '@reduxjs/toolkit';
  
    interface Credentials {
      username: string;
      password: string;
    }
  
    export const login: AsyncThunk<{ token: string }, Credentials, { rejectValue: string }>;
  
    const authSlice: Slice;
    export const { logout }: typeof authSlice.actions;
    export default authSlice.reducer;
  }