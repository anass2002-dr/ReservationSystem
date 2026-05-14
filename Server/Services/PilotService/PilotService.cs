using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.PilotRepo;

namespace ReservationSystem_backend.Services.PilotService
{
    public class PilotService : IPilotService
    {
        private readonly IPilotRepo _repo;

        public PilotService(IPilotRepo repo)
        {
            _repo = repo;
        }

        public List<Pilot> GetPilots()
        {
            return _repo.GetPilots();
        }

        public Pilot GetPilotById(int id)
        {
            return _repo.GetPilotById(id);
        }

        public Pilot AddPilot(PilotDtos dto)
        {
            var entity = new Pilot
            {
                FullName = dto.FullName,
                LicenseNumber = dto.LicenseNumber,
                Status = dto.Status,
                PilotGroupId = dto.PilotGroupId
            };
            return _repo.AddPilot(entity);
        }

        public Pilot UpdatePilot(int id, PilotDtos dto)
        {
            var existingEntity = _repo.GetPilotById(id);
            if (existingEntity != null)
            {
                existingEntity.FullName = string.IsNullOrEmpty(dto.FullName) ? existingEntity.FullName : dto.FullName;
                existingEntity.LicenseNumber = string.IsNullOrEmpty(dto.LicenseNumber) ? existingEntity.LicenseNumber : dto.LicenseNumber;
                existingEntity.Status = dto.Status;
                existingEntity.PilotGroupId = dto.PilotGroupId;
            }
            return _repo.UpdatePilot(id, existingEntity);
        }

        public bool DeletePilot(int id)
        {
            return _repo.DeletePilot(id);
        }
    }
}