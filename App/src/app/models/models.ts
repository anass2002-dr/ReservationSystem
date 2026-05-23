export interface Customer {
  id?: number;
  fullName: string;
  dateOfBirth: string | Date;
  phoneNumber: string;
  email?: string;
  country?: string;
}

export interface PilotGroup {
  id?: number;
  name: string;
  pilots?: Pilot[];
}

export interface Pilot {
  id?: number;
  fullName: string;
  licenseNumber: string;
  status: PilotStatus;
  pilotGroupId?: number;
  flightsAssigned?: number;
  flightsFlown?: number;
  groupName?: string;
}

export enum PilotStatus {
  Active = 0,
  InFlight = 1,
  OffDuty = 2
}

export enum PilotAttendanceStatus {
  Pending = 0,
  Confirmed = 1,
  NoShow = 2
}

export interface TransportGroup {
  id?: number;
  departureTime: string | Date;
  vehiclePlate: string;
  driverName: string;
}

export interface FlightPackage {
  id?: number;
  title: string;
  price: number;
  details?: string;
}

export interface ExtraService {
  id?: number;
  name: string;
  price: number;
}

export interface ReservationDetail {
  id?: number;
  reservationId?: number;
  customerId: number;
  pilotId?: number;
  flightPackageId?: number;
  transportGroupId?: number;
  weightLimitStatus: boolean;
  pilotAttendance?: PilotAttendanceStatus;
  pilotNote?: string;
  extraServiceIds: number[];
  customer?: Customer;
}

export interface FlightTime {
  id?: number;
  time: string;
  isActive: boolean;
}

export interface Agency {
  id?: number;
  name: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface Reservation {
  id?: number;
  flightDate: string;
  title?: string;
  flightTimeId: number;
  flightTime?: string;
  totalAmount?: number;
  preferredCurrency?: PaymentCurrency;
  status: ReservationStatus;
  notes?: string;
  pickupStatus?: PickupStatus;
  pickupLocation?: string;
  isAgencyBooking: boolean;
  agencyId?: number;
  agencyName?: string;
  agencyPrice?: number;
  deposit?: number;
  depositMethod?: PaymentMethod;
  details: ReservationDetail[];
  photos?: ReservationPhoto[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export enum PickupStatus {
  NotRequired = 0,
  Pending = 1,
  PickedUp = 2,
  NoShow = 3
}

export enum ReservationStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2
}

export interface Payment {
  id?: number;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  paymentDate: string | Date;
  notes?: string;
  reservationId: number;
}

export enum PaymentCurrency {
  TL = 0,
  USD = 1,
  EUR = 2,
  GBP = 3
}

export enum PaymentMethod {
  Cash = 0,
  Card = 1,
  Transfer = 2
}

export interface Country {
  name: string;
  code: string;
}

export interface ReservationPhoto {
  id?: number;
  reservationId?: number;
  photoData: string; // base64 string
  fileName?: string;
  contentType?: string;
}
