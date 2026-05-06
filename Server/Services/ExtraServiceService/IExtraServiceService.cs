using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.ExtraServiceService
{
    public interface IExtraServiceService
    {
        List<ExtraService> GetExtraServices();
        ExtraService GetExtraServiceById(int id);
        ExtraService AddExtraService(ExtraServiceDtos dto);
        ExtraService UpdateExtraService(int id, ExtraServiceDtos dto);
        bool DeleteExtraService(int id);
    }
}