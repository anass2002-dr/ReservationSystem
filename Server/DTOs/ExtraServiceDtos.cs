using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class ExtraServiceDtos
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }

        public ExtraServiceDtos() { }

        public ExtraServiceDtos(ExtraService model)
        {
            Id = model.Id;
            Name = model.Name;
            Price = model.Price;
        }
    }
}