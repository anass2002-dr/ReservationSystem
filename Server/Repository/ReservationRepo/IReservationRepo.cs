using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.ReservationRepo
{
    public interface IReservationRepo
    {
        List<Reservation> GetReservations();
        Reservation GetReservationById(int id);
        Reservation AddReservation(Reservation entity);
        Reservation UpdateReservation(int id, Reservation entity);
        bool UpdatePilotAttendance(int detailId, PilotAttendanceStatus status, string? note);
        bool DeleteReservation(int id);
    }
}