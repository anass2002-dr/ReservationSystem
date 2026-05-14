using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Services.PilotGroupService
{
    public interface IPilotGroupService
    {
        Task<IEnumerable<PilotGroup>> GetPilotGroups();
        Task<PilotGroup?> GetPilotGroup(int id);
        Task<PilotGroup> CreatePilotGroup(PilotGroup pilotGroup);
        Task UpdatePilotGroup(int id, PilotGroup pilotGroup);
        Task DeletePilotGroup(int id);
    }
}
