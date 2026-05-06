using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.TransportGroupRepo;

namespace ReservationSystem_backend.Services.TransportGroupService
{
    public class TransportGroupService : ITransportGroupService
    {
        private readonly ITransportGroupRepo _repo;

        public TransportGroupService(ITransportGroupRepo repo)
        {
            _repo = repo;
        }

        public List<TransportGroup> GetTransportGroups()
        {
            return _repo.GetTransportGroups();
        }

        public TransportGroup GetTransportGroupById(int id)
        {
            return _repo.GetTransportGroupById(id);
        }

        public TransportGroup AddTransportGroup(TransportGroupDtos dto)
        {
            var entity = new TransportGroup
            {
                DepartureTime = dto.DepartureTime,
                VehiclePlate = dto.VehiclePlate,
                DriverName = dto.DriverName,
            };
            return _repo.AddTransportGroup(entity);
        }

        public TransportGroup UpdateTransportGroup(int id, TransportGroupDtos dto)
        {
            var existingEntity = _repo.GetTransportGroupById(id);
            if (existingEntity != null)
            {
                existingEntity.DepartureTime = dto.DepartureTime;
                existingEntity.VehiclePlate = string.IsNullOrEmpty(dto.VehiclePlate) ? existingEntity.VehiclePlate : dto.VehiclePlate;
                existingEntity.DriverName = string.IsNullOrEmpty(dto.DriverName) ? existingEntity.DriverName : dto.DriverName;
            }
            return _repo.UpdateTransportGroup(id, existingEntity);
        }

        public bool DeleteTransportGroup(int id)
        {
            return _repo.DeleteTransportGroup(id);
        }
    }
}