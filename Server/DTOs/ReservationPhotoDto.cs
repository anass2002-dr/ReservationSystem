using System;

namespace ReservationSystem_backend.DTOs
{
    public class ReservationPhotoDto
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public string PhotoData { get; set; } = null!; // Base64 representation
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
    }
}
