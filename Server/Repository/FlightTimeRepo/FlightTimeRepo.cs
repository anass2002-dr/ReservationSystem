using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.FlightTimeRepo
{
    public interface IFlightTimeRepo
    {
        List<FlightTime> GetFlightTimes();
        FlightTime GetFlightTimeById(int id);
        FlightTime AddFlightTime(FlightTime entity);
        FlightTime UpdateFlightTime(int id, FlightTime entity);
        bool DeleteFlightTime(int id);
    }

    public class FlightTimeRepo : IFlightTimeRepo
    {
        private readonly ApplicationDbContext _context;

        public FlightTimeRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<FlightTime> GetFlightTimes()
        {
            return _context.FlightTimes.ToList();
        }

        public FlightTime GetFlightTimeById(int id)
        {
            return _context.FlightTimes.Find(id);
        }

        public FlightTime AddFlightTime(FlightTime entity)
        {
            _context.FlightTimes.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public FlightTime UpdateFlightTime(int id, FlightTime entity)
        {
            _context.FlightTimes.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteFlightTime(int id)
        {
            var entity = GetFlightTimeById(id);
            if (entity != null)
            {
                _context.FlightTimes.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
