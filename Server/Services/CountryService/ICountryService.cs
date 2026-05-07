using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.CountryService
{
    public interface ICountryService
    {
        List<Country> GetCountrys();
        Country GetCountryById(int id);
        Country AddCountry(CountryDtos dto);
        Country UpdateCountry(int id, CountryDtos dto);
        bool DeleteCountry(int id);
    }
}