using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.ExtraServiceRepo
{
    public interface IExtraServiceRepo
    {
        List<ExtraService> GetExtraServices();
        ExtraService GetExtraServiceById(int id);
        ExtraService AddExtraService(ExtraService entity);
        ExtraService UpdateExtraService(int id, ExtraService entity);
        bool DeleteExtraService(int id);
    }
}