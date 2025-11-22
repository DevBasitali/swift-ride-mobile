// Mock user database
export const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    password: '123456',
    role: 'renter',
    kycStatus: 'approved',
    cnicFrontUrl: 'https://via.placeholder.com/400x250?text=CNIC+Front',
    cnicBackUrl: 'https://via.placeholder.com/400x250?text=CNIC+Back',
    selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
    walletBalance: 500,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@test.com',
    phone: '+1234567891',
    password: '123456',
    role: 'host',
    kycStatus: 'approved',
    cnicFrontUrl: 'https://via.placeholder.com/400x250?text=CNIC+Front',
    cnicBackUrl: 'https://via.placeholder.com/400x250?text=CNIC+Back',
    selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
    walletBalance: 1500,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Mock JWT token generator
export const generateMockToken = (userId) => {
  return `mock_jwt_token_${userId}_${Date.now()}`;
};

// Mock response helper
export const mockApiResponse = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data,
          message: 'Success',
        },
      });
    }, delay);
  });
};

// Mock error response
export const mockApiError = (message, delay = 1000) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: {
            success: false,
            message,
          },
        },
      });
    }, delay);
  });
};