export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://api.swiftride.demo',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  
  // KYC
  UPLOAD_KYC: '/kyc/upload',
  GET_KYC_STATUS: '/kyc/status',
  
  // User
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
};