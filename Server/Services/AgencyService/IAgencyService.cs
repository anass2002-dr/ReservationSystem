using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Services.AgencyService
{
    public interface IAgencyService
    {
        List<Agency> GetAgencies();
        List<ReservationSystem_backend.DTOs.AgencyAnalyticsDto> GetAgenciesAnalytics();
        Agency GetAgencyById(int id);
        Agency AddAgency(Agency entity);
        Agency UpdateAgency(int id, Agency entity);
        bool DeleteAgency(int id);
    }
}
