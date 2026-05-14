using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class PilotGroup : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Pilot> Pilots { get; set; } = new List<Pilot>();
    }
}
