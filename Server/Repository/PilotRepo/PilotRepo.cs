using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.PilotRepo
{
    public class PilotRepo : IPilotRepo
    {
        private readonly ApplicationDbContext _context;

        public PilotRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Pilot> GetPilots()
        {
            return _context.Pilots.ToList();
        }

        public Pilot GetPilotById(int id)
        {
            return _context.Pilots.FirstOrDefault(e => e.Id == id);
        }

        public Pilot AddPilot(Pilot entity)
        {
            _context.Pilots.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Pilot UpdatePilot(int id, Pilot entity)
        {
            _context.Pilots.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeletePilot(int id)
        {
            var entity = GetPilotById(id);
            if (entity != null)
            {
                _context.Pilots.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}