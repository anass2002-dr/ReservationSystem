using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.Repository.AgencyRepo;

namespace ReservationSystem_backend.Services.AgencyService
{
    public class AgencyService : IAgencyService
    {
        private readonly IAgencyRepo _repo;

        public AgencyService(IAgencyRepo repo)
        {
            _repo = repo;
        }

        public List<Agency> GetAgencies()
        {
            return _repo.GetAgencies();
        }

        public Agency GetAgencyById(int id)
        {
            return _repo.GetAgencyById(id);
        }

        public Agency AddAgency(Agency entity)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            return _repo.AddAgency(entity);
        }

        public Agency UpdateAgency(int id, Agency entity)
        {
            var existing = _repo.GetAgencyById(id);
            if (existing != null)
            {
                existing.Name = entity.Name;
                existing.ContactPerson = entity.ContactPerson;
                existing.PhoneNumber = entity.PhoneNumber;
                existing.Email = entity.Email;
                existing.Address = entity.Address;
                existing.UpdatedAt = DateTime.UtcNow;
                return _repo.UpdateAgency(id, existing);
            }
            return null;
        }

        public bool DeleteAgency(int id)
        {
            return _repo.DeleteAgency(id);
        }
    }
}
