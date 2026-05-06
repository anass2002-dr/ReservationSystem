using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Pilot : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LicenseNumber { get; set; } = string.Empty;

        public PilotStatus Status { get; set; } = PilotStatus.Active;

        // Navigation property
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
