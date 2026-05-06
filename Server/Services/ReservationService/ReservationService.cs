using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.ReservationRepo;

namespace ReservationSystem_backend.Services.ReservationService
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepo _repo;

        public ReservationService(IReservationRepo repo)
        {
            _repo = repo;
        }

        public List<Reservation> GetReservations()
        {
            return _repo.GetReservations();
        }

        public Reservation GetReservationById(int id)
        {
            return _repo.GetReservationById(id);
        }

        public Reservation AddReservation(ReservationDtos dto)
        {
            var entity = new Reservation
            {
                FlightDate = dto.FlightDate,
                WeightLimitStatus = dto.WeightLimitStatus,
                Status = dto.Status,
                CustomerId = dto.CustomerId,
                PilotId = dto.PilotId,
                FlightPackageId = dto.FlightPackageId,
                TransportGroupId = dto.TransportGroupId,
            };
            return _repo.AddReservation(entity);
        }

        public Reservation UpdateReservation(int id, ReservationDtos dto)
        {
            var existingEntity = _repo.GetReservationById(id);
            if (existingEntity != null)
            {
                existingEntity.FlightDate = dto.FlightDate;
                existingEntity.WeightLimitStatus = dto.WeightLimitStatus;
                existingEntity.Status = dto.Status;
                existingEntity.CustomerId = dto.CustomerId;
                existingEntity.PilotId = dto.PilotId;
                existingEntity.FlightPackageId = dto.FlightPackageId;
                existingEntity.TransportGroupId = dto.TransportGroupId;
            }
            return _repo.UpdateReservation(id, existingEntity);
        }

        public bool DeleteReservation(int id)
        {
            return _repo.DeleteReservation(id);
        }
    }
}