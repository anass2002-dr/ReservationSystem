using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.CustomerRepo
{
    public class CustomerRepo : ICustomerRepo
    {
        private readonly ApplicationDbContext _context;

        public CustomerRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Customer> GetCustomers()
        {
            return _context.Customers.ToList();
        }

        public Customer GetCustomerById(int id)
        {
            return _context.Customers.FirstOrDefault(e => e.Id == id);
        }

        public Customer AddCustomer(Customer entity)
        {
            _context.Customers.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Customer UpdateCustomer(int id, Customer entity)
        {
            _context.Customers.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteCustomer(int id)
        {
            var entity = GetCustomerById(id);
            if (entity != null)
            {
                _context.Customers.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}