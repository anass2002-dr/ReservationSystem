using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.CustomerRepo
{
    public interface ICustomerRepo
    {
        List<Customer> GetCustomers();
        Customer GetCustomerById(int id);
        Customer AddCustomer(Customer entity);
        Customer UpdateCustomer(int id, Customer entity);
        bool DeleteCustomer(int id);
    }
}