using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class TransportGroup : BaseEntity
    {
        public DateTime DepartureTime { get; set; }

        [Required]
        [MaxLength(20)]
        public string VehiclePlate { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string DriverName { get; set; } = string.Empty;

        // Navigation property
        public ICollection<ReservationDetail> ReservationDetails { get; set; } = new List<ReservationDetail>();
    }
}
