using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Country : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? Code { get; set; }

        // Navigation property
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
