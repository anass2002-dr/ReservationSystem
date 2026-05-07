using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class CustomerDtos
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public int? CountryId { get; set; }

        public CustomerDtos() { }

        public CustomerDtos(Customer model)
        {
            Id = model.Id;
            FullName = model.FullName;
            DateOfBirth = model.DateOfBirth;
            PhoneNumber = model.PhoneNumber;
            Email = model.Email;
            CountryId = model.CountryId;
        }
    }
}