using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Services.PilotGroupService
{
    public class PilotGroupService : IPilotGroupService
    {
        private readonly ApplicationDbContext _context;

        public PilotGroupService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PilotGroup>> GetPilotGroups()
        {
            return await _context.PilotGroups.Include(pg => pg.Pilots).ToListAsync();
        }

        public async Task<PilotGroup?> GetPilotGroup(int id)
        {
            return await _context.PilotGroups.Include(pg => pg.Pilots).FirstOrDefaultAsync(pg => pg.Id == id);
        }

        public async Task<PilotGroup> CreatePilotGroup(PilotGroup pilotGroup)
        {
            _context.PilotGroups.Add(pilotGroup);
            await _context.SaveChangesAsync();
            return pilotGroup;
        }

        public async Task UpdatePilotGroup(int id, PilotGroup pilotGroup)
        {
            if (id != pilotGroup.Id) return;
            _context.Entry(pilotGroup).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePilotGroup(int id)
        {
            var group = await _context.PilotGroups.FindAsync(id);
            if (group != null)
            {
                _context.PilotGroups.Remove(group);
                await _context.SaveChangesAsync();
            }
        }
    }
}
