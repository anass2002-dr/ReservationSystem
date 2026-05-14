using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.AgencyRepo
{
    public class AgencyRepo : IAgencyRepo
    {
        private readonly ApplicationDbContext _context;

        public AgencyRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Agency> GetAgencies()
        {
            return _context.Agencies.ToList();
        }

        public Agency GetAgencyById(int id)
        {
            return _context.Agencies.FirstOrDefault(e => e.Id == id);
        }

        public Agency AddAgency(Agency entity)
        {
            _context.Agencies.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Agency UpdateAgency(int id, Agency entity)
        {
            _context.Agencies.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteAgency(int id)
        {
            var entity = GetAgencyById(id);
            if (entity != null)
            {
                _context.Agencies.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
