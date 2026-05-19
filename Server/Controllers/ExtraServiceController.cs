using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.ExtraServiceService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class ExtraServiceController : ControllerBase
    {
        private readonly IExtraServiceService _service;

        public ExtraServiceController(IExtraServiceService service)
        {
            _service = service;
        }

        [HttpGet("GetExtraServices")]
        public ActionResult<IEnumerable<ExtraService>> GetExtraServices()
        {
            return Ok(_service.GetExtraServices());
        }

        [HttpGet("GetExtraServiceById/{id}")]
        public ActionResult<ExtraService> GetExtraServiceById(int id)
        {
            var entity = _service.GetExtraServiceById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddExtraService")]
        public ActionResult<ExtraService> AddExtraService(ExtraServiceDtos dto)
        {
            return Ok(_service.AddExtraService(dto));
        }

        [HttpPut("UpdateExtraService/{id}")]
        public ActionResult<ExtraService> UpdateExtraService(int id, ExtraServiceDtos dto)
        {
            var updatedEntity = _service.UpdateExtraService(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteExtraService/{id}")]
        public IActionResult DeleteExtraService(int id)
        {
            var result = _service.DeleteExtraService(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}