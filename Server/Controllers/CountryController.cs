using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.CountryService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _service;

        public CountryController(ICountryService service)
        {
            _service = service;
        }

        [HttpGet("GetCountrys")]
        public ActionResult<IEnumerable<Country>> GetCountrys()
        {
            return Ok(_service.GetCountrys());
        }

        [HttpGet("GetCountryById/{id}")]
        public ActionResult<Country> GetCountryById(int id)
        {
            var entity = _service.GetCountryById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddCountry")]
        public ActionResult<Country> AddCountry(CountryDtos dto)
        {
            return Ok(_service.AddCountry(dto));
        }

        [HttpPut("UpdateCountry/{id}")]
        public ActionResult<Country> UpdateCountry(int id, CountryDtos dto)
        {
            var updatedEntity = _service.UpdateCountry(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteCountry/{id}")]
        public IActionResult DeleteCountry(int id)
        {
            var result = _service.DeleteCountry(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}