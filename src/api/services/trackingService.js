// src/api/services/trackingService.js

import { sleep } from '../../utils/helpers';

class TrackingService {
  // Mock start tracking
  async startTracking(bookingId) {
    console.log('🛰️ Starting GPS tracking for:', bookingId);
    await sleep(500);
    return { success: true };
  }

  // Mock get current location
  async getLocation(bookingId) {
    // Simulate movement by adding random small changes to coordinates
    const lat = 31.5204 + (Math.random() * 0.001);
    const lng = 74.3587 + (Math.random() * 0.001);
    const speed = Math.floor(Math.random() * 60); // 0-60 km/h

    return {
      success: true,
      data: {
        latitude: lat,
        longitude: lng,
        speed: speed,
        heading: Math.floor(Math.random() * 360),
        timestamp: new Date().toISOString(),
        isIgnitionOn: true,
      }
    };
  }

  // Mock kill switch
  async toggleKillSwitch(bookingId, status) {
    console.log(`⚠️ Kill Switch ${status ? 'ACTIVATED' : 'DEACTIVATED'} for:`, bookingId);
    await sleep(1000);
    
    return {
      success: true,
      message: status 
        ? 'Car engine disabled successfully' 
        : 'Car engine enabled successfully',
      isKillSwitchActive: status
    };
  }
}

export default new TrackingService();