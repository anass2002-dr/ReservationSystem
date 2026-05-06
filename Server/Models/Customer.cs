using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Customer : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        // Navigation property
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
