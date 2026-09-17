-- Disable foreign key checks for clean seeding
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing non-user data
TRUNCATE TABLE ReservationExtras;
TRUNCATE TABLE ReservationPhotos;
TRUNCATE TABLE ReservationDetails;
TRUNCATE TABLE Payments;
TRUNCATE TABLE Reservations;
TRUNCATE TABLE TransportGroups;
TRUNCATE TABLE Pilots;
TRUNCATE TABLE PilotGroups;
TRUNCATE TABLE FlightPackages;
TRUNCATE TABLE ExtraServices;
TRUNCATE TABLE Customers;
TRUNCATE TABLE Agencies;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Pilot Groups
INSERT INTO PilotGroups (Id, Name, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, 'Alpha Morning Team', NOW(), NOW(), 'System', 'System'),
(2, 'Bravo Afternoon Thermal', NOW(), NOW(), 'System', 'System'),
(3, 'Charlie Sunset Acro', NOW(), NOW(), 'System', 'System');

-- 2. Pilots (Status: 0=Active, 1=InFlight, 2=OffDuty)
INSERT INTO Pilots (Id, FullName, LicenseNumber, Status, PilotGroupId, FlightsAssigned, FlightsFlown, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, 'Burak Demir', 'THK-P5-84920', 0, 1, 24, 22, NOW(), NOW(), 'System', 'System'),
(2, 'Emre Celik', 'THK-P5-91204', 1, 1, 19, 18, NOW(), NOW(), 'System', 'System'),
(3, 'Serkan Ozturk', 'THK-P5-77312', 0, 2, 28, 27, NOW(), NOW(), 'System', 'System'),
(4, 'Onur Aydin', 'THK-P5-66201', 0, 2, 21, 20, NOW(), NOW(), 'System', 'System'),
(5, 'Tolga Koc', 'THK-P5-55109', 1, 3, 16, 15, NOW(), NOW(), 'System', 'System'),
(6, 'Murat Sahin', 'THK-P5-44098', 2, 3, 11, 10, NOW(), NOW(), 'System', 'System'),
(7, 'Kerem Yildiz', 'THK-P5-33987', 0, 1, 14, 13, NOW(), NOW(), 'System', 'System'),
(8, 'Sinan Arslan', 'THK-P5-22876', 0, 2, 17, 16, NOW(), NOW(), 'System', 'System');

-- 3. Flight Packages
INSERT INTO FlightPackages (Id, Title, Price, Details, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, 'Standard Tandem Flight (1700m)', 120.00, 'Classic 30-min scenic tandem flight over Oludeniz Beach and the famous Blue Lagoon from Babadag mountain.', NOW(), NOW(), 'System', 'System'),
(2, 'Deluxe Sunset Thermal Flight (1800m)', 160.00, '40-45 minutes high altitude thermal soaring with gentle spirals during golden hour sunset.', NOW(), NOW(), 'System', 'System'),
(3, 'Extreme Acro & Aerobatics Tandem', 180.00, 'Adrenaline-pumping aerobatics including high-G 360 spirals, wingovers, and asymmetric spirals above the sea.', NOW(), NOW(), 'System', 'System'),
(4, 'Early Bird Sunrise Flight (1700m)', 135.00, 'Quiet 08:30 morning takeoff above cloud inversion layers with crystal clear air and calm conditions.', NOW(), NOW(), 'System', 'System'),
(5, 'VIP 2000m Summit Flight', 210.00, 'Takeoff from the highest Babadag peak (1965m) with top pilot, cable car pass included, and extended airtime.', NOW(), NOW(), 'System', 'System');

-- 4. Extra Services
INSERT INTO ExtraServices (Id, Name, Price, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, 'GoPro 4K Video & High-Res Photos', 40.00, NOW(), NOW(), 'System', 'System'),
(2, '360° Insta360 VR Interactive Video', 60.00, NOW(), NOW(), 'System', 'System'),
(3, 'Extreme Aerobatics In-Flight Add-on', 25.00, NOW(), NOW(), 'System', 'System'),
(4, 'VIP Hotel Transfer (Roundtrip)', 15.00, NOW(), NOW(), 'System', 'System'),
(5, 'Commemorative Flight T-Shirt & Certificate', 20.00, NOW(), NOW(), 'System', 'System');

-- 5. Agencies
INSERT INTO Agencies (Id, Name, ContactPerson, PhoneNumber, Email, Address, CreatedAt, UpdatedAt) VALUES
(1, 'Sky Tourism & Travel', 'Sarah Jenkins', '+90 532 111 2233', 'booking@skytravel.com', 'Oludeniz Beach Caddesi No:12, Fethiye/Mugla', NOW(), NOW()),
(2, 'Turquoise Coast Holidays', 'Mehmet Yilmaz', '+90 533 444 5566', 'info@turquoisecoast.com', 'Hisaronu Mah. Babadag Yolu No:45, Fethiye/Mugla', NOW(), NOW()),
(3, 'Aegean Adventure Tours', 'Elena Petrova', '+90 535 777 8899', 'operations@aegeantours.com', 'Marina Plaza Suites No:8, Fethiye/Mugla', NOW(), NOW()),
(4, 'Blue Lagoon Excursions', 'John Davies', '+90 536 999 0011', 'res@bluelagoonfethiye.com', 'Belcekiz Mah. Sahil Sokak No:3, Oludeniz', NOW(), NOW()),
(5, 'Mediterranean Wings Agency', 'Ali Demir', '+90 538 222 3344', 'contact@medwings.com', 'Ataturk Caddesi No:21, Fethiye/Mugla', NOW(), NOW());

-- 6. Customers
INSERT INTO Customers (Id, FullName, DateOfBirth, PhoneNumber, Email, Country, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, 'Michael Brown', '1990-05-14 00:00:00', '+44 7700 900123', 'michael.brown@gmail.com', 'United Kingdom', NOW(), NOW(), 'System', 'System'),
(2, 'Sophie Martin', '1995-11-20 00:00:00', '+33 612 345678', 'sophie.martin@yahoo.fr', 'France', NOW(), NOW(), 'System', 'System'),
(3, 'Lukas Weber', '1988-03-08 00:00:00', '+49 151 23456789', 'lukas.weber@web.de', 'Germany', NOW(), NOW(), 'System', 'System'),
(4, 'Emily Johnson', '1998-07-22 00:00:00', '+1 202 555 0143', 'emily.j@outlook.com', 'United States', NOW(), NOW(), 'System', 'System'),
(5, 'Caner Yilmaz', '1992-09-12 00:00:00', '+90 531 234 5678', 'caner.yilmaz@gmail.com', 'Turkey', NOW(), NOW(), 'System', 'System'),
(6, 'Ayse Kaya', '1994-01-30 00:00:00', '+90 532 345 6789', 'ayse.kaya@hotmail.com', 'Turkey', NOW(), NOW(), 'System', 'System'),
(7, 'David Wilson', '1985-12-05 00:00:00', '+44 7800 123456', 'david.wilson@hotmail.co.uk', 'United Kingdom', NOW(), NOW(), 'System', 'System'),
(8, 'Jessica Miller', '1999-04-18 00:00:00', '+1 312 555 0198', 'jessica.miller@gmail.com', 'United States', NOW(), NOW(), 'System', 'System'),
(9, 'Tariq Al-Mansoor', '1991-08-25 00:00:00', '+971 50 123 4567', 'tariq.mansoor@emirates.ae', 'United Arab Emirates', NOW(), NOW(), 'System', 'System'),
(10, 'Anna Kowalska', '1996-02-14 00:00:00', '+48 601 234 567', 'anna.k@wp.pl', 'Poland', NOW(), NOW(), 'System', 'System'),
(11, 'Matteo Rossi', '1993-06-19 00:00:00', '+39 340 123 4567', 'matteo.rossi@libero.it', 'Italy', NOW(), NOW(), 'System', 'System'),
(12, 'Fatima Zahra El Amrani', '1997-10-03 00:00:00', '+212 661 234567', 'fz.amrani@gmail.com', 'Morocco', NOW(), NOW(), 'System', 'System');

-- 7. Transport Groups
INSERT INTO TransportGroups (Id, DepartureTime, VehiclePlate, DriverName, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, '2026-09-17 07:45:00', '48 BB 789', 'Ahmet Vural', NOW(), NOW(), 'System', 'System'),
(2, '2026-09-17 09:45:00', '48 TT 124', 'Huseyin Karaca', NOW(), NOW(), 'System', 'System'),
(3, '2026-09-17 12:15:00', '48 OL 552', 'Mustafa Kurt', NOW(), NOW(), 'System', 'System'),
(4, '2026-09-17 14:15:00', '48 FD 901', 'Kemal Celik', NOW(), NOW(), 'System', 'System'),
(5, '2026-09-17 16:15:00', '48 EK 330', 'Okan Yildirim', NOW(), NOW(), 'System', 'System');

-- 8. Flight Times (Ensure standard active times)
INSERT INTO FlightTimes (Id, Time, IsActive, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
(1, '08:30', 1, NOW(), NOW(), 'System', 'System'),
(2, '10:30', 1, NOW(), NOW(), 'System', 'System'),
(3, '13:00', 1, NOW(), NOW(), 'System', 'System'),
(4, '15:00', 1, NOW(), NOW(), 'System', 'System'),
(5, '17:00', 1, NOW(), NOW(), 'System', 'System')
ON DUPLICATE KEY UPDATE IsActive=1, UpdatedAt=NOW();

-- 9. Reservations
-- Currency: 0=TL, 1=USD, 2=EUR, 3=GBP
-- Status: 0=Pending, 1=Confirmed, 2=Cancelled
-- PickupStatus: 0=NotRequired, 1=Pending, 2=PickedUp, 3=NoShow
-- DepositMethod: 0=Cash, 1=Card, 2=Transfer

INSERT INTO Reservations (Id, Title, FlightDate, FlightTimeId, TotalAmount, PreferredCurrency, Deposit, DepositMethod, DepositCurrency, BilletNumber, Status, Notes, PickupStatus, PickupLocation, IsAgencyBooking, AgencyId, AgencyPrice, BookingSource, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
-- Reservation 1: Today 08:30 (Michael Brown - VIP Summit, Direct, Confirmed, PickedUp)
(1, 'VIP Summit Tandem - Michael Brown', '2026-09-17 08:30:00', 1, 270.00, 1, 100.00, 1, 1, 'TKT-2026-001', 1, 'Wants 360 VR video. First time flying.', 2, 'Liberty Hotels Lykia - Room 304', 0, NULL, NULL, 'Website Direct', NOW(), NOW(), 'System', 'System'),

-- Reservation 2: Today 10:30 (Sophie Martin & Lukas Weber - Sky Tourism Agency, Confirmed, PickedUp)
(2, 'Duo Tandem Flight - Sky Tourism', '2026-09-17 10:30:00', 2, 320.00, 1, 120.00, 2, 1, 'TKT-2026-002', 1, 'Couple flight side by side. GoPro package included.', 2, 'Belcekiz Beach Club', 1, 1, 280.00, 'Sky Tourism & Travel', NOW(), NOW(), 'System', 'System'),

-- Reservation 3: Today 13:00 (Emily Johnson - Extreme Acro, Direct, Confirmed, PickedUp)
(3, 'Extreme Acro Flight - Emily Johnson', '2026-09-17 13:00:00', 3, 205.00, 1, 50.00, 0, 1, 'TKT-2026-003', 1, 'Requested spiral dive and high-G acrobatic maneuvers over water.', 2, 'Montana Pine Resort', 0, NULL, NULL, 'Direct Walk-in', NOW(), NOW(), 'System', 'System'),

-- Reservation 4: Today 15:00 (Caner & Ayse Yilmaz - Standard Duo, Turquoise Coast Agency, Confirmed, Pending Pickup)
(4, 'Tandem Duo - Turquoise Coast Agency', '2026-09-17 15:00:00', 4, 300.00, 0, 4000.00, 1, 0, 'TKT-2026-004', 1, 'Local Turkish tourists. Photos and GoPro package requested.', 1, 'Garcia Resort & Spa - Main Gate', 1, 2, 260.00, 'Turquoise Coast Holidays', NOW(), NOW(), 'System', 'System'),

-- Reservation 5: Today 17:00 (David Wilson - Sunset Thermal, Direct, Confirmed, Pending Pickup)
(5, 'Sunset Thermal Soaring - David Wilson', '2026-09-17 17:00:00', 5, 220.00, 3, 50.00, 1, 3, 'TKT-2026-005', 1, 'Photographer. Special golden hour lighting flight.', 1, 'Oludeniz Turquoise Hotel', 0, NULL, NULL, 'Phone Reservation', NOW(), NOW(), 'System', 'System'),

-- Reservation 6: Tomorrow 08:30 (Jessica Miller - Early Bird Sunrise, Direct, Confirmed)
(6, 'Early Bird Sunrise - Jessica Miller', '2026-09-18 08:30:00', 1, 175.00, 1, 50.00, 1, 1, 'TKT-2026-006', 1, 'Sunrise morning flight. Wants video sent via Google Drive.', 1, 'Orka Sunlife Resort', 0, NULL, NULL, 'Website Direct', NOW(), NOW(), 'System', 'System'),

-- Reservation 7: Tomorrow 10:30 (Tariq Al-Mansoor & Family - VIP Group 2 pax, Aegean Tours Agency, Confirmed)
(7, 'VIP Group Booking - Aegean Tours', '2026-09-18 10:30:00', 2, 490.00, 1, 200.00, 2, 1, 'TKT-2026-007', 1, 'VIP Arab tourists. VIP Summit flights + VR 360 for both.', 1, 'Hillside Beach Club Fethiye', 1, 3, 440.00, 'Aegean Adventure Tours', NOW(), NOW(), 'System', 'System'),

-- Reservation 8: Tomorrow 13:00 (Anna Kowalska - Standard Tandem, Direct, Pending Confirmation)
(8, 'Standard Tandem - Anna Kowalska', '2026-09-18 13:00:00', 3, 160.00, 2, 40.00, 0, 2, 'TKT-2026-008', 0, 'Awaiting deposit bank confirmation slip.', 1, 'Alize Hotel Oludeniz', 0, NULL, NULL, 'WhatsApp Inquiry', NOW(), NOW(), 'System', 'System'),

-- Reservation 9: Tomorrow 17:00 (Matteo Rossi - Sunset Thermal, Blue Lagoon Agency, Confirmed)
(9, 'Sunset Flight - Blue Lagoon Agency', '2026-09-18 17:00:00', 5, 200.00, 2, 60.00, 1, 2, 'TKT-2026-009', 1, 'Agency booking from Blue Lagoon Excursions. Hotel pickup required.', 1, 'Club Tuana Fethiye', 1, 4, 180.00, 'Blue Lagoon Excursions', NOW(), NOW(), 'System', 'System'),

-- Reservation 10: Yesterday 10:30 (Fatima Zahra El Amrani - Completed flight)
(10, 'Standard Tandem - Fatima Zahra', '2026-09-16 10:30:00', 2, 160.00, 1, 160.00, 1, 1, 'TKT-2026-010', 1, 'Flight completed successfully. Photos delivered.', 2, 'Sun City Hotel Oludeniz', 0, NULL, NULL, 'Walk-in Desk', NOW(), NOW(), 'System', 'System'),

-- Reservation 11: Cancelled test reservation (Bad weather test)
(11, 'Cancelled Flight - Weather Alert', '2026-09-16 15:00:00', 4, 120.00, 1, 0.00, NULL, 1, 'TKT-2026-011', 2, 'Cancelled due to high crosswinds at 1700m takeoff. Full refund processed.', 0, NULL, 0, NULL, NULL, 'Direct', NOW(), NOW(), 'System', 'System');

-- 10. Reservation Details (Passengers / Flight Items)
-- PilotAttendance: 0=Pending, 1=Confirmed, 2=NoShow
INSERT INTO ReservationDetails (Id, ReservationId, CustomerId, PilotId, FlightPackageId, TransportGroupId, WeightLimitStatus, PilotAttendance, PilotNote, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
-- For Reservation 1 (Michael Brown)
(1, 1, 1, 1, 5, 1, 1, 1, 'Excellent smooth flight, gentle thermal conditions at 2000m.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 2 (Sophie Martin & Lukas Weber - Duo)
(2, 2, 2, 2, 1, 2, 1, 1, 'Flown in formation with Lukas and pilot Serkan.', NOW(), NOW(), 'System', 'System'),
(3, 2, 3, 3, 1, 2, 1, 1, 'Flown side by side with Sophie.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 3 (Emily Johnson)
(4, 3, 4, 4, 3, 3, 1, 1, 'Acrobatics completed: 3 deep spirals and wingovers over lagoon.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 4 (Caner & Ayse Yilmaz)
(5, 4, 5, 5, 1, 4, 1, 1, 'Checked in and ready at departure station.', NOW(), NOW(), 'System', 'System'),
(6, 4, 6, 7, 1, 4, 1, 1, 'Checked in and ready at departure station.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 5 (David Wilson)
(7, 5, 7, 8, 2, 5, 1, 1, 'Sunset thermal flight planned for 17:00.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 6 (Jessica Miller)
(8, 6, 8, 1, 4, 1, 1, 0, 'Assigned pilot Burak Demir for tomorrow morning sunrise.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 7 (Tariq Al-Mansoor & Guest - Duo)
(9, 7, 9, 3, 5, 2, 1, 0, 'VIP Summit flight tomorrow 10:30.', NOW(), NOW(), 'System', 'System'),
(10, 7, 10, 4, 5, 2, 1, 0, 'VIP Summit flight tomorrow 10:30.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 8 (Anna Kowalska)
(11, 8, 10, 2, 1, 3, 1, 0, 'Pending deposit receipt confirmation.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 9 (Matteo Rossi)
(12, 9, 11, 5, 2, 5, 1, 0, 'Assigned pilot Tolga Koc for sunset.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 10 (Fatima Zahra - Past completed)
(13, 10, 12, 1, 1, 2, 1, 1, 'Smooth landing on Belcekiz beach.', NOW(), NOW(), 'System', 'System'),

-- For Reservation 11 (Cancelled)
(14, 11, 1, 6, 1, NULL, 1, 2, 'High wind cancellation.', NOW(), NOW(), 'System', 'System');

-- 11. Reservation Extras (Many-to-Many via ReservationDetailId & ExtraServiceId)
INSERT INTO ReservationExtras (ReservationDetailId, ExtraServiceId) VALUES
-- Detail 1 (Michael Brown): 360 VR (2)
(1, 2),
-- Detail 2 (Sophie Martin): GoPro Photos/Video (1)
(2, 1),
-- Detail 3 (Lukas Weber): GoPro Photos/Video (1)
(3, 1),
-- Detail 4 (Emily Johnson): Extreme Acro Add-on (3)
(4, 3),
-- Detail 5 (Caner Yilmaz): GoPro (1)
(5, 1),
-- Detail 6 (Ayse Kaya): GoPro (1)
(6, 1),
-- Detail 7 (David Wilson): 360 VR (2)
(7, 2),
-- Detail 8 (Jessica Miller): GoPro (1)
(8, 1),
-- Detail 9 (Tariq Al-Mansoor): 360 VR (2)
(9, 2),
-- Detail 10 (Guest): 360 VR (2)
(10, 2),
-- Detail 11 (Anna Kowalska): GoPro (1)
(11, 1),
-- Detail 12 (Matteo Rossi): GoPro (1)
(12, 1),
-- Detail 13 (Fatima Zahra): GoPro (1)
(13, 1);

-- 12. Payments
-- Method: 0=Cash, 1=Card, 2=Transfer
-- Currency: 0=TL, 1=USD, 2=EUR, 3=GBP
INSERT INTO Payments (Id, ReservationId, Amount, Currency, Method, PaymentDate, Notes, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) VALUES
-- Reservation 1 (Total: 270 USD, Deposit: 100 USD card, Rest: 170 USD cash on arrival)
(1, 1, 100.00, 1, 1, '2026-09-17 07:30:00', 'Deposit paid online via Visa/Mastercard', NOW(), NOW(), 'System', 'System'),
(2, 1, 170.00, 1, 0, '2026-09-17 08:15:00', 'Remaining balance paid in Cash at office', NOW(), NOW(), 'System', 'System'),

-- Reservation 2 (Total: 320 USD, Deposit: 120 USD bank transfer)
(3, 2, 120.00, 1, 2, '2026-09-16 16:00:00', 'Agency deposit prepayment received from Sky Tourism', NOW(), NOW(), 'System', 'System'),
(4, 2, 200.00, 1, 1, '2026-09-17 10:00:00', 'Balance paid by agency credit card', NOW(), NOW(), 'System', 'System'),

-- Reservation 3 (Total: 205 USD, Deposit: 50 USD cash)
(5, 3, 50.00, 1, 0, '2026-09-17 11:30:00', 'Deposit paid in cash upon booking', NOW(), NOW(), 'System', 'System'),
(6, 3, 155.00, 1, 1, '2026-09-17 12:45:00', 'Final payment by credit card', NOW(), NOW(), 'System', 'System'),

-- Reservation 4 (Total in TL: Deposit 4000 TL)
(7, 4, 4000.00, 0, 1, '2026-09-17 13:00:00', 'Credit card deposit processed in TRY (TL)', NOW(), NOW(), 'System', 'System'),

-- Reservation 5 (Total in GBP: 220 GBP, Deposit: 50 GBP)
(8, 5, 50.00, 3, 1, '2026-09-17 14:00:00', 'Deposit paid by UK Debit Card', NOW(), NOW(), 'System', 'System'),

-- Reservation 6 (Tomorrow: 175 USD, Deposit: 50 USD)
(9, 6, 50.00, 1, 1, '2026-09-17 18:00:00', 'Online reservation deposit', NOW(), NOW(), 'System', 'System'),

-- Reservation 7 (Tomorrow VIP: 490 USD, Deposit: 200 USD transfer)
(10, 7, 200.00, 1, 2, '2026-09-17 15:30:00', 'Bank Wire deposit from Aegean Tours Agency', NOW(), NOW(), 'System', 'System'),

-- Reservation 8 (Tomorrow EUR: 160 EUR, Deposit: 40 EUR cash)
(11, 8, 40.00, 2, 0, '2026-09-17 19:00:00', 'Cash deposit in EUR', NOW(), NOW(), 'System', 'System'),

-- Reservation 9 (Tomorrow EUR: 200 EUR, Deposit: 60 EUR card)
(12, 9, 60.00, 2, 1, '2026-09-17 17:45:00', 'Pre-authorization on Card', NOW(), NOW(), 'System', 'System'),

-- Reservation 10 (Past completed: 160 USD full payment)
(13, 10, 160.00, 1, 1, '2026-09-16 10:00:00', 'Full payment by credit card at desk', NOW(), NOW(), 'System', 'System');
