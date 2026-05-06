using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class ReservationDtos
    {
        public int Id { get; set; }
        public DateTime FlightDate { get; set; }
        public bool WeightLimitStatus { get; set; }
        public ReservationStatus Status { get; set; }
        public int CustomerId { get; set; }
        public int PilotId { get; set; }
        public int FlightPackageId { get; set; }
        public int? TransportGroupId { get; set; }

        public ReservationDtos() { }

        public ReservationDtos(Reservation model)
        {
            Id = model.Id;
            FlightDate = model.FlightDate;
            WeightLimitStatus = model.WeightLimitStatus;
            Status = model.Status;
            CustomerId = model.CustomerId;
            PilotId = model.PilotId;
            FlightPackageId = model.FlightPackageId;
            TransportGroupId = model.TransportGroupId;
        }
    }
}