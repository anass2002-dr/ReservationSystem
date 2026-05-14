using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class FlightTime : BaseEntity
    {
        [Required]
        [MaxLength(10)]
        public string Time { get; set; } = string.Empty; // e.g. "08:30"

        public bool IsActive { get; set; } = true;

        // Navigation property
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
