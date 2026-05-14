using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.ReservationService
{
    public interface IReservationService
    {
        List<ReservationDtos> GetReservations();
        ReservationDtos GetReservationById(int id);
        ReservationDtos AddReservation(ReservationDtos dto);
        ReservationDtos UpdateReservation(int id, ReservationDtos dto);
        bool DeleteReservation(int id);
    }
}