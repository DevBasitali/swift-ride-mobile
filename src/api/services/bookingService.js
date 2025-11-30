// src/api/services/bookingService.js

import { sleep } from '../../utils/helpers';

const MOCK_BOOKINGS = [
  {
    id: 'BK101',
    car: {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      image: 'https://via.placeholder.com/400x300?text=Toyota+Corolla',
      plateNumber: 'ABC-123'
    },
    host: {
      id: '2',
      name: 'Jane Smith',
      phone: '03001234567',
      image: null
    },
    renter: {
      id: '1',
      name: 'John Doe',
      phone: '03007654321',
      image: null
    },
    status: 'upcoming', // upcoming, active, completed, cancelled
    totalAmount: 4500,
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 172800000).toISOString(),
    pickupLocation: 'DHA Phase 5, Lahore',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BK102',
    car: {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      image: 'https://via.placeholder.com/400x300?text=Honda+Civic',
      plateNumber: 'XYZ-789'
    },
    host: { id: '2', name: 'Jane Smith' },
    renter: { id: '1', name: 'John Doe' },
    status: 'completed',
    totalAmount: 1500,
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 86400000).toISOString(),
    pickupLocation: 'Gulberg, Lahore',
    createdAt: new Date().toISOString()
  }
];

class BookingService {
  // Get bookings for current user
  async getUserBookings(userId, role) {
    console.log(`📅 Mock Get Bookings for ${role}: ${userId}`);
    await sleep(1000);
    return {
      success: true,
      data: MOCK_BOOKINGS
    };
  }

  // Get single booking details
  async getBookingById(bookingId) {
    console.log('📅 Mock Get Booking Detail:', bookingId);
    await sleep(500);
    
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    return {
      success: true,
      data: booking
    };
  }

  // Create new booking
  async createBooking(bookingData) {
    console.log('➕ Mock Create Booking:', bookingData);
    await sleep(1500);

    const newBooking = {
      id: `BK${Date.now()}`,
      ...bookingData,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    MOCK_BOOKINGS.unshift(newBooking);

    return {
      success: true,
      message: 'Booking confirmed successfully',
      data: newBooking
    };
  }

  // ✅ NEW: Update booking status
  async updateBookingStatus(bookingId, status) {
    console.log(`🔄 Updating booking ${bookingId} to ${status}`);
    await sleep(500);
    
    const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      MOCK_BOOKINGS[bookingIndex].status = status;
      return { success: true, data: MOCK_BOOKINGS[bookingIndex] };
    }
    
    return { success: false, message: 'Booking not found' };
  }
}

export default new BookingService();