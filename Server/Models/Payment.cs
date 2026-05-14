using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.Models
{
    public class Payment : BaseEntity
    {
        public decimal Amount { get; set; }

        public PaymentCurrency Currency { get; set; }

        public PaymentMethod Method { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public string? Notes { get; set; }

        // Foreign Keys
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;
    }
}
