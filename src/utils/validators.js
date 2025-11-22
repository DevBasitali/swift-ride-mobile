import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['renter', 'host', 'both'], 'Please select a valid role')
    .required('Please select your role'),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

// Individual validators
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};