using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class CountryDtos
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Code { get; set; }

        public CountryDtos() { }

        public CountryDtos(Country model)
        {
            Id = model.Id;
            Name = model.Name;
            Code = model.Code;
        }
    }
}