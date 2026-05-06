using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.FlightPackageRepo;

namespace ReservationSystem_backend.Services.FlightPackageService
{
    public class FlightPackageService : IFlightPackageService
    {
        private readonly IFlightPackageRepo _repo;

        public FlightPackageService(IFlightPackageRepo repo)
        {
            _repo = repo;
        }

        public List<FlightPackage> GetFlightPackages()
        {
            return _repo.GetFlightPackages();
        }

        public FlightPackage GetFlightPackageById(int id)
        {
            return _repo.GetFlightPackageById(id);
        }

        public FlightPackage AddFlightPackage(FlightPackageDtos dto)
        {
            var entity = new FlightPackage
            {
                Title = dto.Title,
                Price = dto.Price,
            };
            return _repo.AddFlightPackage(entity);
        }

        public FlightPackage UpdateFlightPackage(int id, FlightPackageDtos dto)
        {
            var existingEntity = _repo.GetFlightPackageById(id);
            if (existingEntity != null)
            {
                existingEntity.Title = string.IsNullOrEmpty(dto.Title) ? existingEntity.Title : dto.Title;
                existingEntity.Price = dto.Price;
            }
            return _repo.UpdateFlightPackage(id, existingEntity);
        }

        public bool DeleteFlightPackage(int id)
        {
            return _repo.DeleteFlightPackage(id);
        }
    }
}