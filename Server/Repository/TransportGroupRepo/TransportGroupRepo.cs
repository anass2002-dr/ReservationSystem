using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.TransportGroupRepo
{
    public class TransportGroupRepo : ITransportGroupRepo
    {
        private readonly ApplicationDbContext _context;

        public TransportGroupRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<TransportGroup> GetTransportGroups()
        {
            return _context.TransportGroups.ToList();
        }

        public TransportGroup GetTransportGroupById(int id)
        {
            return _context.TransportGroups.FirstOrDefault(e => e.Id == id);
        }

        public TransportGroup AddTransportGroup(TransportGroup entity)
        {
            _context.TransportGroups.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public TransportGroup UpdateTransportGroup(int id, TransportGroup entity)
        {
            _context.TransportGroups.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteTransportGroup(int id)
        {
            var entity = GetTransportGroupById(id);
            if (entity != null)
            {
                _context.TransportGroups.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}