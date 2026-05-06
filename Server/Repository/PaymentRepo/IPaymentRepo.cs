using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.PaymentRepo
{
    public interface IPaymentRepo
    {
        List<Payment> GetPayments();
        Payment GetPaymentById(int id);
        Payment AddPayment(Payment entity);
        Payment UpdatePayment(int id, Payment entity);
        bool DeletePayment(int id);
    }
}