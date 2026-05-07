using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.CountryRepo
{
    public class CountryRepo : ICountryRepo
    {
        private readonly ApplicationDbContext _context;

        public CountryRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Country> GetCountrys()
        {
            return _context.Countries.ToList();
        }

        public Country GetCountryById(int id)
        {
            return _context.Countries.FirstOrDefault(e => e.Id == id);
        }

        public Country AddCountry(Country entity)
        {
            _context.Countries.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Country UpdateCountry(int id, Country entity)
        {
            _context.Countries.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteCountry(int id)
        {
            var entity = GetCountryById(id);
            if (entity != null)
            {
                _context.Countries.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}