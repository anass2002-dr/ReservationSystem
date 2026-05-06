using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.ReservationService
{
    public interface IReservationService
    {
        List<Reservation> GetReservations();
        Reservation GetReservationById(int id);
        Reservation AddReservation(ReservationDtos dto);
        Reservation UpdateReservation(int id, ReservationDtos dto);
        bool DeleteReservation(int id);
    }
}