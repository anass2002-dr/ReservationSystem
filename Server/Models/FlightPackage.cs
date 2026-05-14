using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class FlightPackage : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? Details { get; set; }

        // Navigation property
        public ICollection<ReservationDetail> ReservationDetails { get; set; } = new List<ReservationDetail>();
    }
}
