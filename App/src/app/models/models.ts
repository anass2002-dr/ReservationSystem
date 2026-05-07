export interface Customer {
  id?: number;
  fullName: string;
  dateOfBirth: string | Date;
  phoneNumber: string;
  email?: string;
  countryId?: number;
}

export interface Pilot {
  id?: number;
  fullName: string;
  licenseNumber: string;
  status: PilotStatus;
}

export enum PilotStatus {
  Active = 0,
  InFlight = 1,
  OffDuty = 2
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
}

export interface ExtraService {
  id?: number;
  name: string;
  price: number;
}

export interface Reservation {
  id?: number;
  flightDate: string | Date;
  weightLimitStatus: boolean;
  status: ReservationStatus;
  customerId: number;
  pilotId: number;
  flightPackageId: number;
  transportGroupId?: number;
  extraServiceIds?: number[];
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
  reservationId: number;
}

export enum PaymentCurrency {
  TL = 0,
  USD = 1,
  EUR = 2
}

export enum PaymentMethod {
  Cash = 0,
  Card = 1
}

export interface Country {
  id?: number;
  name: string;
  code?: string;
}
