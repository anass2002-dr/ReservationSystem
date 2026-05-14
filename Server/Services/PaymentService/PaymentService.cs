using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.PaymentRepo;

namespace ReservationSystem_backend.Services.PaymentService
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepo _repo;

        public PaymentService(IPaymentRepo repo)
        {
            _repo = repo;
        }

        public List<Payment> GetPayments()
        {
            return _repo.GetPayments();
        }

        public Payment GetPaymentById(int id)
        {
            return _repo.GetPaymentById(id);
        }

        public Payment AddPayment(PaymentDtos dto)
        {
            var entity = new Payment
            {
                Amount = dto.Amount,
                Currency = dto.Currency,
                Method = dto.Method,
                PaymentDate = dto.PaymentDate,
                Notes = dto.Notes,
                ReservationId = dto.ReservationId,
            };
            return _repo.AddPayment(entity);
        }

        public Payment UpdatePayment(int id, PaymentDtos dto)
        {
            var existingEntity = _repo.GetPaymentById(id);
            if (existingEntity != null)
            {
                existingEntity.Amount = dto.Amount;
                existingEntity.Currency = dto.Currency;
                existingEntity.Method = dto.Method;
                existingEntity.PaymentDate = dto.PaymentDate;
                existingEntity.Notes = dto.Notes;
                existingEntity.ReservationId = dto.ReservationId;
            }
            return _repo.UpdatePayment(id, existingEntity);
        }

        public bool DeletePayment(int id)
        {
            return _repo.DeletePayment(id);
        }
    }
}