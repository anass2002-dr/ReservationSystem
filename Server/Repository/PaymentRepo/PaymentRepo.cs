using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.PaymentRepo
{
    public class PaymentRepo : IPaymentRepo
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Payment> GetPayments()
        {
            return _context.Payments.ToList();
        }

        public Payment GetPaymentById(int id)
        {
            return _context.Payments.FirstOrDefault(e => e.Id == id);
        }

        public Payment AddPayment(Payment entity)
        {
            _context.Payments.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Payment UpdatePayment(int id, Payment entity)
        {
            _context.Payments.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeletePayment(int id)
        {
            var entity = GetPaymentById(id);
            if (entity != null)
            {
                _context.Payments.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}