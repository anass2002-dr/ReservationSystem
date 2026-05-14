using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.CustomerRepo;

namespace ReservationSystem_backend.Services.CustomerService
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepo _repo;

        public CustomerService(ICustomerRepo repo)
        {
            _repo = repo;
        }

        public List<Customer> GetCustomers()
        {
            return _repo.GetCustomers();
        }

        public Customer GetCustomerById(int id)
        {
            return _repo.GetCustomerById(id);
        }

        public Customer AddCustomer(CustomerDtos dto)
        {
            var entity = new Customer
            {
                FullName = dto.FullName,
                DateOfBirth = dto.DateOfBirth,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Country = dto.Country,
            };
            return _repo.AddCustomer(entity);
        }

        public Customer UpdateCustomer(int id, CustomerDtos dto)
        {
            var existingEntity = _repo.GetCustomerById(id);
            if (existingEntity != null)
            {
                existingEntity.FullName = string.IsNullOrEmpty(dto.FullName) ? existingEntity.FullName : dto.FullName;
                existingEntity.DateOfBirth = dto.DateOfBirth;
                existingEntity.PhoneNumber = dto.PhoneNumber ?? existingEntity.PhoneNumber;
                existingEntity.Email = dto.Email ?? existingEntity.Email;
                existingEntity.Country = dto.Country;
            }
            return _repo.UpdateCustomer(id, existingEntity);
        }

        public bool DeleteCustomer(int id)
        {
            return _repo.DeleteCustomer(id);
        }
    }
}