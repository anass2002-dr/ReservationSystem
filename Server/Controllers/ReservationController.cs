using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.ReservationService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _service;

        public ReservationController(IReservationService service)
        {
            _service = service;
        }

        [HttpGet("GetReservations")]
        public ActionResult<IEnumerable<Reservation>> GetReservations()
        {
            return Ok(_service.GetReservations());
        }

        [HttpGet("GetReservationById/{id}")]
        public ActionResult<Reservation> GetReservationById(int id)
        {
            var entity = _service.GetReservationById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddReservation")]
        public ActionResult<Reservation> AddReservation(ReservationDtos dto)
        {
            return Ok(_service.AddReservation(dto));
        }

        [HttpPut("UpdateReservation/{id}")]
        public ActionResult<Reservation> UpdateReservation(int id, ReservationDtos dto)
        {
            var updatedEntity = _service.UpdateReservation(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteReservation/{id}")]
        public IActionResult DeleteReservation(int id)
        {
            var result = _service.DeleteReservation(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}