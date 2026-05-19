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
        public int? PilotGroupId { get; set; }
        public int FlightsAssigned { get; set; }
        public int FlightsFlown { get; set; }

        public PilotDtos() { }

        public PilotDtos(Pilot model)
        {
            Id = model.Id;
            FullName = model.FullName;
            LicenseNumber = model.LicenseNumber;
            Status = model.Status;
            PilotGroupId = model.PilotGroupId;
            FlightsAssigned = model.FlightsAssigned;
            FlightsFlown = model.FlightsFlown;
        }
    }
}