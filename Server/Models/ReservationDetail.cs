using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class ReservationDetail : BaseEntity
    {
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int? PilotId { get; set; }
        public Pilot? Pilot { get; set; }

        public int? FlightPackageId { get; set; }
        public FlightPackage? FlightPackage { get; set; }

        public int? TransportGroupId { get; set; }
        public TransportGroup? TransportGroup { get; set; }

        public bool WeightLimitStatus { get; set; }

        public PilotAttendanceStatus PilotAttendance { get; set; } = PilotAttendanceStatus.Pending;
        public string? PilotNote { get; set; }

        // Navigation property
        public ICollection<ReservationExtra> ReservationExtras { get; set; } = new List<ReservationExtra>();
    }
}
