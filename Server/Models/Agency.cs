using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Agency
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [StringLength(100)]
        public string? ContactPerson { get; set; }
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
        
        public string? Address { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationship
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
