using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.PilotService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PilotController : ControllerBase
    {
        private readonly IPilotService _service;

        public PilotController(IPilotService service)
        {
            _service = service;
        }

        [HttpGet("GetPilots")]
        public ActionResult<IEnumerable<Pilot>> GetPilots()
        {
            return Ok(_service.GetPilots());
        }

        [HttpGet("GetPilotById/{id}")]
        public ActionResult<Pilot> GetPilotById(int id)
        {
            var entity = _service.GetPilotById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddPilot")]
        public ActionResult<Pilot> AddPilot(PilotDtos dto)
        {
            return Ok(_service.AddPilot(dto));
        }

        [HttpPut("UpdatePilot/{id}")]
        public ActionResult<Pilot> UpdatePilot(int id, PilotDtos dto)
        {
            var updatedEntity = _service.UpdatePilot(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeletePilot/{id}")]
        public IActionResult DeletePilot(int id)
        {
            var result = _service.DeletePilot(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}