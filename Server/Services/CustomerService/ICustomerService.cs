using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.CustomerService
{
    public interface ICustomerService
    {
        List<Customer> GetCustomers();
        Customer GetCustomerById(int id);
        Customer AddCustomer(CustomerDtos dto);
        Customer UpdateCustomer(int id, CustomerDtos dto);
        bool DeleteCustomer(int id);
    }
}