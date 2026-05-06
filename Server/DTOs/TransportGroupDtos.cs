using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class TransportGroupDtos
    {
        public int Id { get; set; }
        public DateTime DepartureTime { get; set; }
        public string VehiclePlate { get; set; }
        public string DriverName { get; set; }

        public TransportGroupDtos() { }

        public TransportGroupDtos(TransportGroup model)
        {
            Id = model.Id;
            DepartureTime = model.DepartureTime;
            VehiclePlate = model.VehiclePlate;
            DriverName = model.DriverName;
        }
    }
}