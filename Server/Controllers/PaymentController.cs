using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.PaymentService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentController(IPaymentService service)
        {
            _service = service;
        }

        [HttpGet("GetPayments")]
        public ActionResult<IEnumerable<Payment>> GetPayments()
        {
            return Ok(_service.GetPayments());
        }

        [HttpGet("GetPaymentById/{id}")]
        public ActionResult<Payment> GetPaymentById(int id)
        {
            var entity = _service.GetPaymentById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddPayment")]
        public ActionResult<Payment> AddPayment(PaymentDtos dto)
        {
            return Ok(_service.AddPayment(dto));
        }

        [HttpPut("UpdatePayment/{id}")]
        public ActionResult<Payment> UpdatePayment(int id, PaymentDtos dto)
        {
            var updatedEntity = _service.UpdatePayment(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeletePayment/{id}")]
        public IActionResult DeletePayment(int id)
        {
            var result = _service.DeletePayment(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}