using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.PilotRepo
{
    public interface IPilotRepo
    {
        List<Pilot> GetPilots();
        Pilot GetPilotById(int id);
        Pilot AddPilot(Pilot entity);
        Pilot UpdatePilot(int id, Pilot entity);
        bool DeletePilot(int id);
    }
}