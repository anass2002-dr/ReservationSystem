using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.ExtraServiceRepo;

namespace ReservationSystem_backend.Services.ExtraServiceService
{
    public class ExtraServiceService : IExtraServiceService
    {
        private readonly IExtraServiceRepo _repo;

        public ExtraServiceService(IExtraServiceRepo repo)
        {
            _repo = repo;
        }

        public List<ExtraService> GetExtraServices()
        {
            return _repo.GetExtraServices();
        }

        public ExtraService GetExtraServiceById(int id)
        {
            return _repo.GetExtraServiceById(id);
        }

        public ExtraService AddExtraService(ExtraServiceDtos dto)
        {
            var entity = new ExtraService
            {
                Name = dto.Name,
                Price = dto.Price,
            };
            return _repo.AddExtraService(entity);
        }

        public ExtraService UpdateExtraService(int id, ExtraServiceDtos dto)
        {
            var existingEntity = _repo.GetExtraServiceById(id);
            if (existingEntity != null)
            {
                existingEntity.Name = string.IsNullOrEmpty(dto.Name) ? existingEntity.Name : dto.Name;
                existingEntity.Price = dto.Price;
            }
            return _repo.UpdateExtraService(id, existingEntity);
        }

        public bool DeleteExtraService(int id)
        {
            return _repo.DeleteExtraService(id);
        }
    }
}