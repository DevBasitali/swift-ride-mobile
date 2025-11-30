// src/api/services/authService.js

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    password: '123456',
    role: 'renter',
    kycStatus: 'approved',
    walletBalance: 500,
    profilePicture: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@test.com',
    phone: '+1234567891',
    password: '123456',
    role: 'host',
    kycStatus: 'approved',
    walletBalance: 1500,
    profilePicture: null,
  },
];

// Helper function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  // Mock Login
  async login(credentials) {
    console.log('🔐 Mock Login:', credentials.email);
    
    // Simulate API delay
    await sleep(1000);
    
    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock_token_${user.id}_${Date.now()}`;
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful',
    };
  }

  // Mock Register
  async register(userData) {
    console.log('📝 Mock Register:', userData.email);
    
    await sleep(1000);
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'renter',
      kycStatus: 'pending',
      walletBalance: 0,
      profilePicture: null,
    };
    
    MOCK_USERS.push({ ...newUser, password: userData.password });
    
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    return {
      success: true,
      token,
      user: newUser,
      message: 'Registration successful',
    };
  }

  // Mock Forgot Password
  async forgotPassword(email) {
    console.log('📧 Mock Forgot Password:', email);
    
    await sleep(1000);
    
    const user = MOCK_USERS.find((u) => u.email === email);
    
    if (!user) {
      throw new Error('Email not found');
    }
    
    return {
      success: true,
      message: 'Password reset email sent to ' + email,
    };
  }

  // Mock Reset Password
  async resetPassword(token, newPassword) {
    console.log('🔑 Mock Reset Password');
    
    await sleep(1000);
    
    return {
      success: true,
      message: 'Password reset successful',
    };
  }

  // Mock Logout
  async logout() {
    console.log('👋 Mock Logout');
    await sleep(500);
    return { success: true, message: 'Logged out successfully' };
  }

  // Mock Upload KYC
  async uploadKYC(kycData) {
    console.log('📸 Mock Upload KYC');
    
    await sleep(2000);
    
    return {
      success: true,
      message: 'KYC documents uploaded successfully',
      data: {
        kycStatus: 'pending',
        cnicFrontUrl: kycData.cnicFront,
        cnicBackUrl: kycData.cnicBack,
        selfieUrl: kycData.selfie,
      }
    };
  }

  // Mock Get Profile
  async getProfile() {
    console.log('👤 Mock Get Profile');
    
    await sleep(500);
    
    // Return first user as mock
    const user = MOCK_USERS[0];
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
    };
  }

  // Mock Update Profile
  async updateProfile(profileData) {
    console.log('✏️ Mock Update Profile:', profileData);
    
    await sleep(1000);
    
    return {
      success: true,
      message: 'Profile updated successfully',
      user: profileData,
    };
  }
}

export default new AuthService();