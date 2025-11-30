// src/api/services/carService.js

import { sleep } from '../../utils/helpers';

// Mock car database
let MOCK_CARS = [
  {
    id: '1',
    hostId: '2', // Jane (host)
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    color: 'White',
    plateNumber: 'ABC-123',
    pricePerHour: 500,
    pricePerDay: 3000,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    photos: [
      'https://via.placeholder.com/400x300?text=Toyota+Corolla+1',
      'https://via.placeholder.com/400x300?text=Toyota+Corolla+2',
      'https://via.placeholder.com/400x300?text=Toyota+Corolla+3',
    ],
    location: {
      address: 'DHA Phase 5, Lahore',
      lat: 31.4697,
      lng: 74.4044,
    },
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    },
    features: ['AC', 'USB Charger', 'Bluetooth', 'GPS'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    hostId: '2', // Jane (host)
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    color: 'Black',
    plateNumber: 'XYZ-789',
    pricePerHour: 700,
    pricePerDay: 4500,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    photos: [
      'https://via.placeholder.com/400x300?text=Honda+Civic+1',
      'https://via.placeholder.com/400x300?text=Honda+Civic+2',
    ],
    location: {
      address: 'Gulberg, Lahore',
      lat: 31.5204,
      lng: 74.3587,
    },
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Mon-Sat
      startTime: '08:00',
      endTime: '18:00',
      isAvailable: true,
    },
    features: ['AC', 'Sunroof', 'Parking Sensors', 'Cruise Control'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
];

// ✅ FIX: Use counter for unique IDs instead of array length
let carIdCounter = 3; // Start from 3 since we have cars with IDs 1 and 2

class CarService {
  // Get all cars for a specific host
  async getHostCars(hostId) {
    console.log('🚗 Mock Get Host Cars:', hostId);
    await sleep(800);
    
    const cars = MOCK_CARS.filter(car => car.hostId === hostId);
    
    return {
      success: true,
      data: cars,
      total: cars.length,
    };
  }

  // Get single car by ID
  async getCarById(carId) {
    console.log('🚗 Mock Get Car:', carId);
    await sleep(500);
    
    const car = MOCK_CARS.find(c => c.id === carId);
    
    if (!car) {
      throw new Error('Car not found');
    }
    
    return {
      success: true,
      data: car,
    };
  }

  // Add new car
  async addCar(carData) {
    console.log('➕ Mock Add Car:', carData);
    await sleep(1500);
    
    // ✅ FIX: Use counter instead of array length
    const newCar = {
      id: `${carIdCounter++}`, // Increment counter for unique ID
      ...carData,
      isActive: true,
      createdAt: new Date(),
    };
    
    MOCK_CARS.push(newCar);
    
    console.log('✅ Car added with ID:', newCar.id);
    
    return {
      success: true,
      message: 'Car added successfully',
      data: newCar,
    };
  }

  // Update car
  async updateCar(carId, carData) {
    console.log('✏️ Mock Update Car:', carId, carData);
    await sleep(1000);
    
    const index = MOCK_CARS.findIndex(c => c.id === carId);
    
    if (index === -1) {
      throw new Error('Car not found');
    }
    
    MOCK_CARS[index] = {
      ...MOCK_CARS[index],
      ...carData,
      id: carId, // ✅ Preserve original ID
      updatedAt: new Date(),
    };
    
    return {
      success: true,
      message: 'Car updated successfully',
      data: MOCK_CARS[index],
    };
  }

  // Delete car
  async deleteCar(carId) {
    console.log('🗑️ Mock Delete Car:', carId);
    await sleep(800);
    
    const index = MOCK_CARS.findIndex(c => c.id === carId);
    
    if (index === -1) {
      throw new Error('Car not found');
    }
    
    const deletedCar = MOCK_CARS[index];
    MOCK_CARS.splice(index, 1);
    
    console.log(`✅ Car ${carId} deleted. Remaining cars:`, MOCK_CARS.length);
    
    return {
      success: true,
      message: 'Car deleted successfully',
      data: deletedCar,
    };
  }

  // Toggle car availability
  async toggleCarAvailability(carId) {
    console.log('🔄 Mock Toggle Car Availability:', carId);
    await sleep(500);
    
    const car = MOCK_CARS.find(c => c.id === carId);
    
    if (!car) {
      throw new Error('Car not found');
    }
    
    car.availability.isAvailable = !car.availability.isAvailable;
    
    return {
      success: true,
      message: `Car ${car.availability.isAvailable ? 'activated' : 'deactivated'}`,
      data: car,
    };
  }

  // Get all cars (for renters to browse)
  async getAllCars(filters = {}) {
    console.log('🔍 Mock Get All Cars:', filters);
    await sleep(1000);
    
    let cars = [...MOCK_CARS].filter(car => car.isActive && car.availability.isAvailable);
    
    // Apply filters if any
    if (filters.minPrice) {
      cars = cars.filter(c => c.pricePerHour >= filters.minPrice);
    }
    if (filters.maxPrice) {
      cars = cars.filter(c => c.pricePerHour <= filters.maxPrice);
    }
    if (filters.transmission) {
      cars = cars.filter(c => c.transmission === filters.transmission);
    }
    
    return {
      success: true,
      data: cars,
      total: cars.length,
    };
  }

  // ✅ Helper: Reset mock data (for testing)
  resetMockData() {
    MOCK_CARS = [
      {
        id: '1',
        hostId: '2',
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'White',
        plateNumber: 'ABC-123',
        pricePerHour: 500,
        pricePerDay: 3000,
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        photos: [
          'https://via.placeholder.com/400x300?text=Toyota+Corolla',
        ],
        location: {
          address: 'DHA Phase 5, Lahore',
          lat: 31.4697,
          lng: 74.4044,
        },
        availability: {
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        },
        features: ['AC', 'USB Charger', 'Bluetooth', 'GPS'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        hostId: '2',
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        color: 'Black',
        plateNumber: 'XYZ-789',
        pricePerHour: 700,
        pricePerDay: 4500,
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        photos: [
          'https://via.placeholder.com/400x300?text=Honda+Civic',
        ],
        location: {
          address: 'Gulberg, Lahore',
          lat: 31.5204,
          lng: 74.3587,
        },
        availability: {
          daysOfWeek: [1, 2, 3, 4, 5, 6],
          startTime: '08:00',
          endTime: '18:00',
          isAvailable: true,
        },
        features: ['AC', 'Sunroof', 'Parking Sensors', 'Cruise Control'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
      },
    ];
    carIdCounter = 3;
    console.log('🔄 Mock data reset');
  }
}

export default new CarService();