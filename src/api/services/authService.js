import { MOCK_USERS, generateMockToken, mockApiResponse, mockApiError } from '../mockData';
import { sleep } from '../../utils/helpers';

class AuthService {
  // Login
  async login(credentials) {
    console.log('🔐 Mock Login:', credentials);
    
    // Simulate API delay
    await sleep(1500);
    
    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw {
        response: {
          data: {
            success: false,
            message: 'Invalid email or password',
          },
        },
      };
    }
    
    const token = generateMockToken(user.id);
    const { password, ...userWithoutPassword } = user;
    
    return {
      data: {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'Login successful',
      },
    };
  }

  // Register
  async register(userData) {
    console.log('📝 Mock Register:', userData);
    
    await sleep(1500);
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
    
    if (existingUser) {
      throw {
        response: {
          data: {
            success: false,
            message: 'Email already registered',
          },
        },
      };
    }
    
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      kycStatus: 'pending',
      cnicFrontUrl: null,
      cnicBackUrl: null,
      selfieUrl: null,
      walletBalance: 0,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_USERS.push({ ...newUser, password: userData.password });
    
    const token = generateMockToken(newUser.id);
    
    return {
      data: {
        success: true,
        data: {
          user: newUser,
          token,
        },
        message: 'Registration successful',
      },
    };
  }

  // Forgot Password
  async forgotPassword(email) {
    console.log('📧 Mock Forgot Password:', email);
    
    await sleep(1500);
    
    const user = MOCK_USERS.find((u) => u.email === email);
    
    if (!user) {
      throw {
        response: {
          data: {
            success: false,
            message: 'Email not found',
          },
        },
      };
    }
    
    return {
      data: {
        success: true,
        data: {
          message: 'OTP sent to your email',
          otp: '123456', // In real app, this wouldn't be returned
        },
        message: 'OTP sent successfully',
      },
    };
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    console.log('🔢 Mock Verify OTP:', { email, otp });
    
    await sleep(1000);
    
    // Mock: any 6-digit code works
    if (otp === '123456') {
      return {
        data: {
          success: true,
          data: {
            verified: true,
          },
          message: 'OTP verified successfully',
        },
      };
    }
    
    throw {
      response: {
        data: {
          success: false,
          message: 'Invalid OTP',
        },
      },
    };
  }

  // Reset Password
  async resetPassword(email, otp, newPassword) {
    console.log('🔑 Mock Reset Password:', { email, otp });
    
    await sleep(1500);
    
    const user = MOCK_USERS.find((u) => u.email === email);
    
    if (!user || otp !== '123456') {
      throw {
        response: {
          data: {
            success: false,
            message: 'Invalid OTP or email',
          },
        },
      };
    }
    
    user.password = newPassword;
    
    return {
      data: {
        success: true,
        message: 'Password reset successful',
      },
    };
  }

  // Upload KYC
  async uploadKYC(kycData) {
    console.log('📸 Mock Upload KYC:', kycData);
    
    await sleep(2000);
    
    return {
      data: {
        success: true,
        data: {
          kycStatus: 'pending',
          cnicFrontUrl: kycData.cnicFront,
          cnicBackUrl: kycData.cnicBack,
          selfieUrl: kycData.selfie,
        },
        message: 'KYC documents uploaded successfully. Verification in progress.',
      },
    };
  }

  // Get KYC Status
  async getKYCStatus(userId) {
    console.log('📋 Mock Get KYC Status:', userId);
    
    await sleep(1000);
    
    const user = MOCK_USERS.find((u) => u.id === userId);
    
    return {
      data: {
        success: true,
        data: {
          kycStatus: user?.kycStatus || 'pending',
          cnicFrontUrl: user?.cnicFrontUrl,
          cnicBackUrl: user?.cnicBackUrl,
          selfieUrl: user?.selfieUrl,
        },
      },
    };
  }

  // Logout (client-side only)
  async logout() {
    console.log('👋 Mock Logout');
    await sleep(500);
    return { data: { success: true, message: 'Logged out successfully' } };
  }
}

export default new AuthService();