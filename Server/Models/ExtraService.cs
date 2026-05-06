using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class ExtraService : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        // Navigation property
        public ICollection<ReservationExtra> ReservationExtras { get; set; } = new List<ReservationExtra>();
    }
}
