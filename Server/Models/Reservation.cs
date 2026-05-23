using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Reservation : BaseEntity
    {
        public DateTime FlightDate { get; set; }
        public string? Title { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentCurrency PreferredCurrency { get; set; } = PaymentCurrency.USD;
        public decimal Deposit { get; set; }
        public PaymentMethod? DepositMethod { get; set; }

        public int FlightTimeId { get; set; }
        public FlightTime FlightTime { get; set; } = null!;

        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
        public string? Notes { get; set; }
        
        public PickupStatus PickupStatus { get; set; } = PickupStatus.NotRequired;
        public string? PickupLocation { get; set; }

        // Agency Info
        public bool IsAgencyBooking { get; set; }
        public int? AgencyId { get; set; }
        public Agency? Agency { get; set; }
        public decimal? AgencyPrice { get; set; }

        // Navigation properties
        public ICollection<ReservationDetail> ReservationDetails { get; set; } = new List<ReservationDetail>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<ReservationPhoto> ReservationPhotos { get; set; } = new List<ReservationPhoto>();
    }
}
