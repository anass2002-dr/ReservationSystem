using System;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class PaymentDtos
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public PaymentCurrency Currency { get; set; }
        public PaymentMethod Method { get; set; }
        public DateTime PaymentDate { get; set; }
        public int ReservationId { get; set; }

        public PaymentDtos() { }

        public PaymentDtos(Payment model)
        {
            Id = model.Id;
            Amount = model.Amount;
            Currency = model.Currency;
            Method = model.Method;
            PaymentDate = model.PaymentDate;
            ReservationId = model.ReservationId;
        }
    }
}