using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.PaymentService
{
    public interface IPaymentService
    {
        List<Payment> GetPayments();
        Payment GetPaymentById(int id);
        Payment AddPayment(PaymentDtos dto);
        Payment UpdatePayment(int id, PaymentDtos dto);
        bool DeletePayment(int id);
    }
}