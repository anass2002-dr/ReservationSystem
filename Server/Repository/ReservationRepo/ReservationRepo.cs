using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.ReservationRepo
{
    public class ReservationRepo : IReservationRepo
    {
        private readonly ApplicationDbContext _context;

        public ReservationRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Reservation> GetReservations()
        {
            return _context.Reservations
                .Include(r => r.FlightTime)
                .Include(r => r.Agency)
                .Include(r => r.ReservationDetails)
                    .ThenInclude(rd => rd.ReservationExtras)
                .Include(r => r.ReservationDetails)
                    .ThenInclude(rd => rd.Customer)
                .Include(r => r.ReservationPhotos)
                .ToList();
        }

        public Reservation GetReservationById(int id)
        {
            return _context.Reservations
                .Include(r => r.FlightTime)
                .Include(r => r.Agency)
                .Include(r => r.ReservationDetails)
                    .ThenInclude(rd => rd.ReservationExtras)
                .Include(r => r.ReservationDetails)
                    .ThenInclude(rd => rd.Customer)
                .Include(r => r.ReservationPhotos)
                .FirstOrDefault(e => e.Id == id);
        }

        public Reservation AddReservation(Reservation entity)
        {
            _context.Reservations.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Reservation UpdateReservation(int id, Reservation entity)
        {
            _context.Reservations.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool UpdatePilotAttendance(int detailId, PilotAttendanceStatus status, string? note)
        {
            var detail = _context.ReservationDetails
                .Include(d => d.Pilot)
                .FirstOrDefault(d => d.Id == detailId);

            if (detail == null || detail.PilotId == null) return false;

            // Only update metrics if transitioning from Pending
            if (detail.PilotAttendance == PilotAttendanceStatus.Pending && status != PilotAttendanceStatus.Pending)
            {
                if (status == PilotAttendanceStatus.Confirmed)
                {
                    detail.Pilot.FlightsAssigned++;
                    detail.Pilot.FlightsFlown++;
                }
                else if (status == PilotAttendanceStatus.NoShow)
                {
                    detail.Pilot.FlightsAssigned++;
                    // Flown remains unchanged
                }
            }

            detail.PilotAttendance = status;
            detail.PilotNote = note;

            _context.SaveChanges();
            return true;
        }

        public bool DeleteReservation(int id)
        {
            var entity = GetReservationById(id);
            if (entity != null)
            {
                _context.Reservations.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}