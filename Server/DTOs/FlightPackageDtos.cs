using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class FlightPackageDtos
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string? Details { get; set; }

        public FlightPackageDtos() { }

        public FlightPackageDtos(FlightPackage model)
        {
            Id = model.Id;
            Title = model.Title;
            Price = model.Price;
            Details = model.Details;
        }
    }
}