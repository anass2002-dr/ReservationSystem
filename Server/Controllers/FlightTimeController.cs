using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.FlightTimeService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightTimeController : ControllerBase
    {
        private readonly IFlightTimeService _service;

        public FlightTimeController(IFlightTimeService service)
        {
            _service = service;
        }

        [HttpGet("GetFlightTimes")]
        public ActionResult<IEnumerable<FlightTimeDtos>> GetFlightTimes()
        {
            return Ok(_service.GetFlightTimes());
        }

        [HttpGet("GetFlightTimeById/{id}")]
        public ActionResult<FlightTimeDtos> GetFlightTimeById(int id)
        {
            var result = _service.GetFlightTimeById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("AddFlightTime")]
        public ActionResult<FlightTimeDtos> AddFlightTime(FlightTimeDtos dto)
        {
            return Ok(_service.AddFlightTime(dto));
        }

        [HttpPut("UpdateFlightTime/{id}")]
        public ActionResult<FlightTimeDtos> UpdateFlightTime(int id, FlightTimeDtos dto)
        {
            var result = _service.UpdateFlightTime(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("DeleteFlightTime/{id}")]
        public ActionResult<bool> DeleteFlightTime(int id)
        {
            return Ok(_service.DeleteFlightTime(id));
        }
    }
}
