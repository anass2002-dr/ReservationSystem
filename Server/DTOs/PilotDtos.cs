using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class PilotDtos
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string LicenseNumber { get; set; }
        public PilotStatus Status { get; set; }

        public PilotDtos() { }

        public PilotDtos(Pilot model)
        {
            Id = model.Id;
            FullName = model.FullName;
            LicenseNumber = model.LicenseNumber;
            Status = model.Status;
        }
    }
}