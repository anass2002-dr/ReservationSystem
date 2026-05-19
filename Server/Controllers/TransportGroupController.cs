using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.TransportGroupService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class TransportGroupController : ControllerBase
    {
        private readonly ITransportGroupService _service;

        public TransportGroupController(ITransportGroupService service)
        {
            _service = service;
        }

        [HttpGet("GetTransportGroups")]
        public ActionResult<IEnumerable<TransportGroup>> GetTransportGroups()
        {
            return Ok(_service.GetTransportGroups());
        }

        [HttpGet("GetTransportGroupById/{id}")]
        public ActionResult<TransportGroup> GetTransportGroupById(int id)
        {
            var entity = _service.GetTransportGroupById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddTransportGroup")]
        public ActionResult<TransportGroup> AddTransportGroup(TransportGroupDtos dto)
        {
            return Ok(_service.AddTransportGroup(dto));
        }

        [HttpPut("UpdateTransportGroup/{id}")]
        public ActionResult<TransportGroup> UpdateTransportGroup(int id, TransportGroupDtos dto)
        {
            var updatedEntity = _service.UpdateTransportGroup(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteTransportGroup/{id}")]
        public IActionResult DeleteTransportGroup(int id)
        {
            var result = _service.DeleteTransportGroup(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}