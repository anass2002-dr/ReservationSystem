using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.Services.AgencyService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgencyController : ControllerBase
    {
        private readonly IAgencyService _service;

        public AgencyController(IAgencyService service)
        {
            _service = service;
        }

        [HttpGet("GetAgencies")]
        public ActionResult<IEnumerable<Agency>> GetAgencies()
        {
            return Ok(_service.GetAgencies());
        }

        [HttpGet("GetAgencyById/{id}")]
        public ActionResult<Agency> GetAgencyById(int id)
        {
            var entity = _service.GetAgencyById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddAgency")]
        public ActionResult<Agency> AddAgency(Agency entity)
        {
            return Ok(_service.AddAgency(entity));
        }

        [HttpPut("UpdateAgency/{id}")]
        public ActionResult<Agency> UpdateAgency(int id, Agency entity)
        {
            var updatedEntity = _service.UpdateAgency(id, entity);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteAgency/{id}")]
        public IActionResult DeleteAgency(int id)
        {
            var result = _service.DeleteAgency(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
