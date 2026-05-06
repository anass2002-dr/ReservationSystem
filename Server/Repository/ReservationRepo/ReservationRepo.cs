using System.Collections.Generic;
using System.Linq;
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
            return _context.Reservations.ToList();
        }

        public Reservation GetReservationById(int id)
        {
            return _context.Reservations.FirstOrDefault(e => e.Id == id);
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