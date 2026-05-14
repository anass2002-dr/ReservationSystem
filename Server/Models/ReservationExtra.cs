namespace ReservationSystem_backend.Models
{
    public class ReservationExtra
    {
        public int ReservationDetailId { get; set; }
        public ReservationDetail ReservationDetail { get; set; } = null!;

        public int ExtraServiceId { get; set; }
        public ExtraService ExtraService { get; set; } = null!;
    }
}
