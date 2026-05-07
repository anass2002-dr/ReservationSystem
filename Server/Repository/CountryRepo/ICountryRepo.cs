using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.CountryRepo
{
    public interface ICountryRepo
    {
        List<Country> GetCountrys();
        Country GetCountryById(int id);
        Country AddCountry(Country entity);
        Country UpdateCountry(int id, Country entity);
        bool DeleteCountry(int id);
    }
}