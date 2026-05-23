using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class ReservationPhoto : BaseEntity
    {
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;

        public string PhotoData { get; set; } = null!; // Base64 data representation
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
    }
}
