using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.PilotService
{
    public interface IPilotService
    {
        List<Pilot> GetPilots();
        Pilot GetPilotById(int id);
        Pilot AddPilot(PilotDtos dto);
        Pilot UpdatePilot(int id, PilotDtos dto);
        bool DeletePilot(int id);
    }
}