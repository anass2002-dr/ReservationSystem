using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.FlightTimeRepo;

namespace ReservationSystem_backend.Services.FlightTimeService
{
    public interface IFlightTimeService
    {
        List<FlightTimeDtos> GetFlightTimes();
        FlightTimeDtos GetFlightTimeById(int id);
        FlightTimeDtos AddFlightTime(FlightTimeDtos dto);
        FlightTimeDtos UpdateFlightTime(int id, FlightTimeDtos dto);
        bool DeleteFlightTime(int id);
    }

    public class FlightTimeService : IFlightTimeService
    {
        private readonly IFlightTimeRepo _repo;

        public FlightTimeService(IFlightTimeRepo repo)
        {
            _repo = repo;
        }

        public List<FlightTimeDtos> GetFlightTimes()
        {
            var entities = _repo.GetFlightTimes();
            var dtos = new List<FlightTimeDtos>();
            foreach (var entity in entities)
            {
                dtos.Add(new FlightTimeDtos(entity));
            }
            return dtos;
        }

        public FlightTimeDtos GetFlightTimeById(int id)
        {
            var entity = _repo.GetFlightTimeById(id);
            return entity != null ? new FlightTimeDtos(entity) : null;
        }

        public FlightTimeDtos AddFlightTime(FlightTimeDtos dto)
        {
            var entity = new FlightTime
            {
                Time = dto.Time,
                IsActive = dto.IsActive
            };
            var savedEntity = _repo.AddFlightTime(entity);
            return new FlightTimeDtos(savedEntity);
        }

        public FlightTimeDtos UpdateFlightTime(int id, FlightTimeDtos dto)
        {
            var existingEntity = _repo.GetFlightTimeById(id);
            if (existingEntity != null)
            {
                existingEntity.Time = dto.Time;
                existingEntity.IsActive = dto.IsActive;
                var updatedEntity = _repo.UpdateFlightTime(id, existingEntity);
                return new FlightTimeDtos(updatedEntity);
            }
            return null;
        }

        public bool DeleteFlightTime(int id)
        {
            return _repo.DeleteFlightTime(id);
        }
    }
}
