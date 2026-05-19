using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.Services.PilotGroupService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class PilotGroupsController : ControllerBase
    {
        private readonly IPilotGroupService _pilotGroupService;

        public PilotGroupsController(IPilotGroupService pilotGroupService)
        {
            _pilotGroupService = pilotGroupService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PilotGroup>>> GetPilotGroups()
        {
            return Ok(await _pilotGroupService.GetPilotGroups());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PilotGroup>> GetPilotGroup(int id)
        {
            var pilotGroup = await _pilotGroupService.GetPilotGroup(id);
            if (pilotGroup == null) return NotFound();
            return Ok(pilotGroup);
        }

        [HttpPost]
        public async Task<ActionResult<PilotGroup>> PostPilotGroup(PilotGroup pilotGroup)
        {
            var created = await _pilotGroupService.CreatePilotGroup(pilotGroup);
            return CreatedAtAction(nameof(GetPilotGroup), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPilotGroup(int id, PilotGroup pilotGroup)
        {
            await _pilotGroupService.UpdatePilotGroup(id, pilotGroup);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePilotGroup(int id)
        {
            await _pilotGroupService.DeletePilotGroup(id);
            return NoContent();
        }
    }
}
