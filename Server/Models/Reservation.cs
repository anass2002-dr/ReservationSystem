using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Reservation : BaseEntity
    {
        public DateTime FlightDate { get; set; }

        public bool WeightLimitStatus { get; set; }

        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

        // Foreign Keys
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int PilotId { get; set; }
        public Pilot Pilot { get; set; } = null!;

        public int FlightPackageId { get; set; }
        public FlightPackage FlightPackage { get; set; } = null!;

        public int? TransportGroupId { get; set; }
        public TransportGroup? TransportGroup { get; set; }

        // Navigation properties
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<ReservationExtra> ReservationExtras { get; set; } = new List<ReservationExtra>();
    }
}
