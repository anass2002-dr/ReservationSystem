using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Services.CustomerService;

namespace ReservationSystem_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _service;

        public CustomerController(ICustomerService service)
        {
            _service = service;
        }

        [HttpGet("GetCustomers")]
        public ActionResult<IEnumerable<Customer>> GetCustomers()
        {
            return Ok(_service.GetCustomers());
        }

        [HttpGet("GetCustomerById/{id}")]
        public ActionResult<Customer> GetCustomerById(int id)
        {
            var entity = _service.GetCustomerById(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }

        [HttpPost("AddCustomer")]
        public ActionResult<Customer> AddCustomer(CustomerDtos dto)
        {
            return Ok(_service.AddCustomer(dto));
        }

        [HttpPut("UpdateCustomer/{id}")]
        public ActionResult<Customer> UpdateCustomer(int id, CustomerDtos dto)
        {
            var updatedEntity = _service.UpdateCustomer(id, dto);
            if (updatedEntity == null)
            {
                return NotFound();
            }
            return Ok(updatedEntity);
        }

        [HttpDelete("DeleteCustomer/{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            var result = _service.DeleteCustomer(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}