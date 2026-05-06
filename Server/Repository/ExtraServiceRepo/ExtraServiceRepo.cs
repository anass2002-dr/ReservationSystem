using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.ExtraServiceRepo
{
    public class ExtraServiceRepo : IExtraServiceRepo
    {
        private readonly ApplicationDbContext _context;

        public ExtraServiceRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ExtraService> GetExtraServices()
        {
            return _context.ExtraServices.ToList();
        }

        public ExtraService GetExtraServiceById(int id)
        {
            return _context.ExtraServices.FirstOrDefault(e => e.Id == id);
        }

        public ExtraService AddExtraService(ExtraService entity)
        {
            _context.ExtraServices.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public ExtraService UpdateExtraService(int id, ExtraService entity)
        {
            _context.ExtraServices.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteExtraService(int id)
        {
            var entity = GetExtraServiceById(id);
            if (entity != null)
            {
                _context.ExtraServices.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}