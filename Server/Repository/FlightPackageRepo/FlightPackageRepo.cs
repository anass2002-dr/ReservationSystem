using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.FlightPackageRepo
{
    public class FlightPackageRepo : IFlightPackageRepo
    {
        private readonly ApplicationDbContext _context;

        public FlightPackageRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<FlightPackage> GetFlightPackages()
        {
            return _context.FlightPackages.ToList();
        }

        public FlightPackage GetFlightPackageById(int id)
        {
            return _context.FlightPackages.FirstOrDefault(e => e.Id == id);
        }

        public FlightPackage AddFlightPackage(FlightPackage entity)
        {
            _context.FlightPackages.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public FlightPackage UpdateFlightPackage(int id, FlightPackage entity)
        {
            _context.FlightPackages.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteFlightPackage(int id)
        {
            var entity = GetFlightPackageById(id);
            if (entity != null)
            {
                _context.FlightPackages.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}