using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.CountryRepo;

namespace ReservationSystem_backend.Services.CountryService
{
    public class CountryService : ICountryService
    {
        private readonly ICountryRepo _repo;

        public CountryService(ICountryRepo repo)
        {
            _repo = repo;
        }

        public List<Country> GetCountrys()
        {
            return _repo.GetCountrys();
        }

        public Country GetCountryById(int id)
        {
            return _repo.GetCountryById(id);
        }

        public Country AddCountry(CountryDtos dto)
        {
            var entity = new Country
            {
                Name = dto.Name,
                Code = dto.Code,
            };
            return _repo.AddCountry(entity);
        }

        public Country UpdateCountry(int id, CountryDtos dto)
        {
            var existingEntity = _repo.GetCountryById(id);
            if (existingEntity != null)
            {
                existingEntity.Name = string.IsNullOrEmpty(dto.Name) ? existingEntity.Name : dto.Name;
                existingEntity.Code = dto.Code ?? existingEntity.Code;
            }
            return _repo.UpdateCountry(id, existingEntity);
        }

        public bool DeleteCountry(int id)
        {
            return _repo.DeleteCountry(id);
        }
    }
}