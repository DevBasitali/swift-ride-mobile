# swift-ride-mobile

📘 SwiftRide Mobile: Master Technical Documentation & Handoff
Project Name: SwiftRide Mobile (P2P Car Rental)
Framework: React Native (Expo SDK 50+)
Routing: Expo Router v3 (File-based routing)
Backend Status: Hybrid (Real Connection Established + Mock Fallbacks)
Date: May 2024

1. 🧠 Project Overview & Architecture
1.1 Core Concept
SwiftRide is a Peer-to-Peer (P2P) vehicle sharing marketplace.

Renter: Browses maps, books cars, unlocks via QR code.
Host: Lists cars, manages availability, scans QR to handover, tracks vehicles.
SwiftGuard Security: A simulated high-security layer including Biometric Verification, Digital Keys, and Live Speed Monitoring.
1.2 Architectural Pattern
The app follows a Service-Oriented Architecture with Context State Management.

View Layer: app/ (Expo Router screens).
State Layer: src/context/AuthContext.jsx (Global user session).
Logic Layer: src/api/services/ (Classes that handle data fetching).
Crucial Note: These services currently prioritize Mock Data for stability during demos, but the networking infrastructure (src/config/api.config.js) is set up to connect to a local Node.js backend.
2. 📂 Complete Folder Structure
The codebase is organized by Role and Feature.

text

SwiftRide-Mobile/
├── app/                               # EXPO ROUTER (Screens)
│   ├── _layout.jsx                    # Root Provider Wrapper
│   ├── index.jsx                      # Auth Redirect Logic
│   │
│   ├── (auth)/                        # AUTHENTICATION
│   │   ├── login.jsx                  # Login Form
│   │   ├── register.jsx               # Registration (Host/Renter)
│   │   └── kyc-upload.jsx             # ID/Selfie Upload UI
│   │
│   ├── (renter)/                      # RENTER TABS
│   │   ├── home.jsx                   # Google Map + List View
│   │   ├── my-trips.jsx               # Booking History (Upcoming/Active)
│   │   ├── wallet.jsx                 # Balance & Top-up
│   │   └── profile.jsx                # Settings Menu
│   │
│   ├── (host)/                        # HOST TABS
│   │   ├── dashboard.jsx              # Earnings Stats
│   │   ├── trips.jsx                  # Incoming Requests
│   │   ├── my-fleet.jsx               # Car CRUD (List/Delete)
│   │   └── tracker.jsx                # Active Trip Tracking List
│   │
│   ├── cars/                          # CAR MANAGEMENT
│   │   ├── [id].jsx                   # Car Detail View (Dynamic)
│   │   ├── add-car-step1/2/3.jsx      # Creation Wizard
│   │   ├── add-car-scheduler.jsx      # 9-to-5 Availability UI
│   │   └── edit-car.jsx               # Update Car Logic
│   │
│   ├── booking/                       # BOOKING FLOW
│   │   ├── [carId].jsx                # Date Picker & Price Calc
│   │   └── success.jsx                # Confirmation Screen
│   │
│   ├── trip/                          # TRIP LIFECYCLE (P2P Core)
│   │   ├── [bookingId].jsx            # The Hub (QR & Status)
│   │   ├── scan-renter.jsx            # Host Camera Scanner
│   │   ├── condition-check-before.jsx # Pre-Trip Photos
│   │   ├── condition-check-after.jsx  # Post-Trip Photos
│   │   └── end-trip.jsx               # Final Billing & Completion
│   │
│   ├── tracking/                      # LIVE MONITORING
│   │   └── live-map.jsx               # Map, Speed Stats, Safety Alert
│   │
│   ├── modal/                         
│   │   └── filter.jsx                 # Search Filters
│   │
│   └── settings/                      # USER SETTINGS
│       ├── edit-profile.jsx
│       ├── change-password.jsx
│       ├── help.jsx
│       └── payment-methods.jsx
│
├── src/
│   ├── api/services/                  # LOGIC LAYER
│   │   ├── authService.js             # Users & Auth Logic
│   │   ├── carService.js              # Car CRUD & Filtering
│   │   ├── bookingService.js          # Status State Machine
│   │   ├── trackingService.js         # GPS Simulation
│   │   └── walletService.js           # Transactions & Balance
│   │
│   ├── components/                    # UI LIBRARY
│   │   ├── common/                    # Button, Input, Loader
│   │   ├── car/                       # CarCard
│   │   └── trip/                      # TripCard
│   │
│   ├── context/                       # STATE
│   │   └── AuthContext.jsx            # Session Persistence
│   │
│   └── config/                        # CONFIG
│       └── theme.js                   # Colors, Spacing, Fonts
3. 🧠 Logic & Workflows (How it Works)
3.1 The "Handshake" Flow (Start Trip)
This is the most complex logic in the app.

Booking: Created in upcoming state.
Verification:
Renter: Clicks "Verify & Start" 
→
→ Simulates Face ID Check 
→
→ Generates QR Code.
Host: Clicks "Scan QR" 
→
→ Opens Camera 
→
→ Scans Renter's screen.
Validation: If QR JSON matches Booking ID 
→
→ Success.
Inspection: Host navigates to condition-check-before.jsx 
→
→ Uploads 4 photos.
Activation: bookingService.updateBookingStatus(id, 'active') is called.
3.2 The "Return" Flow (End Trip)
Status Check: Host sees trip is active.
End: Host clicks "End Trip".
Inspection: Navigates to condition-check-after.jsx 
→
→ Uploads 4 photos.
Billing: Navigates to end-trip.jsx 
→
→ Shows Invoice.
Completion: bookingService updates status to completed AND walletService credits the Host's balance.
3.3 Smart Tracking (Safety)
Mock Data: trackingService.js generates random lat/lng updates around a central point.
Safety Logic: If the random speed > 80km/h, the UI in live-map.jsx turns RED (Violation Alert).
Digital Key: A simulated switch that "Locks" the car (State update only).
4. 🛠️ Known Technical Decisions (Workarounds)
DateTimePicker: The native package caused crashes on Android.
Current Solution: We replaced it with a custom Modal-based picker in app/booking/[carId].jsx. It is stable and sufficient for demos.
Maps: Google Maps requires an API key.
Current Solution: The key is configured in app.json. We use useIsFocused() hook in home.jsx to prevent map rendering issues during navigation.
Image Picker:
Current Solution: We implemented a "Simulate Photo" option in Alert.alert to ensure testing is possible even on Simulators without cameras.
5. 🧪 Test Credentials
Since the app runs on Mock Services by default:

Role	Email	Password
Renter	john@test.com	123456
Host	jane@test.com	123456
6. 🔮 Future Roadmap (For the Next AI)
If you are the AI reading this, here is your prioritized To-Do list:

Task 1: Backend Connection (The "Real" Switch)
The services currently use sleep() to simulate network.

Action: In src/api/services/*, replace the mock array logic with axios calls to the endpoints defined in src/config/api.config.js.
Note: The backend connection code is already written in authService.js (commented out or partially implemented) but needs to be standardized across carService and bookingService.
Task 2: Real-Time Sockets
Current: Polling (Intervals).
Action: Implement socket.io-client in tracking/live-map.jsx to receive real GPS coordinates instead of mock intervals.
Task 3: Image Uploads
Current: Local URI or Placeholder URLs.
Action: Implement FormData upload in condition-check screens to send actual images to the Node.js server /uploads endpoint.