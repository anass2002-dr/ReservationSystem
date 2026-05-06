namespace ReservationSystem_backend.Models
{
    public class ReservationExtra
    {
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;

        public int ExtraServiceId { get; set; }
        public ExtraService ExtraService { get; set; } = null!;
    }
}
