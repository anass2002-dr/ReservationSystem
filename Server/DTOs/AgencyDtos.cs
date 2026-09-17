using System;
using System.Collections.Generic;

namespace ReservationSystem_backend.DTOs
{
    public class AgencyAnalyticsDto
    {
        public int AgencyId { get; set; }
        public string AgencyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }

        public int TotalReservations { get; set; }
        public int TotalPassengers { get; set; }
        public decimal TotalAgreedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal RemainingBalance { get; set; }

        public int ConfirmedCount { get; set; }
        public int PendingCount { get; set; }
        public int CancelledCount { get; set; }

        public List<AgencyBookingItemDto> Bookings { get; set; } = new List<AgencyBookingItemDto>();
    }

    public class AgencyBookingItemDto
    {
        public int ReservationId { get; set; }
        public string? Title { get; set; }
        public DateTime FlightDate { get; set; }
        public string? FlightTime { get; set; }
        public string? BilletNumber { get; set; }
        public int PassengerCount { get; set; }
        public List<string> PassengerNames { get; set; } = new List<string>();
        public decimal AgreedPrice { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RestToPay { get; set; }
        public int Status { get; set; }
        public int PreferredCurrency { get; set; }
        public string? Notes { get; set; }
    }
}
