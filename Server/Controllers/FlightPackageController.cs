using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.FlightPackageService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightPackageController : ControllerBase
    {
        private readonly IFlightPackageService _service;

        public FlightPackageController(IFlightPackageService service)
        {
            _service = service;
        }

        [HttpGet("GetFlightPackages")]
        public ActionResult<IEnumerable<FlightPackage>> GetFlightPackages()
        {
            return Ok(_service.GetFlightPackages());
        }

        [HttpGet("GetFlightPackageById/{id}")]
        public ActionResult<FlightPackage> GetFlightPackageById(int id)
        {
            var entity = _service.GetFlightPackageById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddFlightPackage")]
        public ActionResult<FlightPackage> AddFlightPackage(FlightPackageDtos dto)
        {
            return Ok(_service.AddFlightPackage(dto));
        }

        [HttpPut("UpdateFlightPackage/{id}")]
        public ActionResult<FlightPackage> UpdateFlightPackage(int id, FlightPackageDtos dto)
        {
            var updatedEntity = _service.UpdateFlightPackage(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteFlightPackage/{id}")]
        public IActionResult DeleteFlightPackage(int id)
        {
            var result = _service.DeleteFlightPackage(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}