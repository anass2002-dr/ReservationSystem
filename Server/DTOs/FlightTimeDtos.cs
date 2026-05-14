using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class FlightTimeDtos
    {
        public int Id { get; set; }
        public string Time { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        public FlightTimeDtos() { }

        public FlightTimeDtos(FlightTime model)
        {
            Id = model.Id;
            Time = model.Time;
            IsActive = model.IsActive;
        }
    }
}
