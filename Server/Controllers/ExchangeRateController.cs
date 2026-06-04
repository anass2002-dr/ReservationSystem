using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class ExchangeRateController : ControllerBase
    {
        private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "exchange_rates.json");

        [HttpGet("GetRates")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public IActionResult GetRates()
        {
            if (System.IO.File.Exists(_filePath))
            {
                var json = System.IO.File.ReadAllText(_filePath);
                return Content(json, "application/json");
            }

            // Default rates if file does not exist
            var defaultRates = new Dictionary<string, decimal>
            {
                { "USD", 1.0m },
                { "TRY", 45.0m },
                { "EUR", 0.92m },
                { "GBP", 0.79m }
            };
            return Ok(defaultRates);
        }

        [HttpPost("UpdateRates")]
        public IActionResult UpdateRates([FromBody] Dictionary<string, decimal> rates)
        {
            if (rates == null || !rates.ContainsKey("USD"))
            {
                return BadRequest("Invalid rates format. Must contain USD as base.");
            }

            // Ensure USD is 1.0 for consistency if it's the base
            rates["USD"] = 1.0m;

            var json = JsonSerializer.Serialize(rates, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, json);

            return Ok(new { message = "Exchange rates updated successfully" });
        }
    }
}
