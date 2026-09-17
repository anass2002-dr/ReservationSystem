using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.AgencyRepo
{
    public class AgencyRepo : IAgencyRepo
    {
        private readonly ApplicationDbContext _context;

        public AgencyRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Agency> GetAgencies()
        {
            return _context.Agencies.ToList();
        }

        public List<AgencyAnalyticsDto> GetAgenciesAnalytics()
        {
            var agencies = _context.Agencies
                .Include(a => a.Reservations)
                    .ThenInclude(r => r.ReservationDetails)
                        .ThenInclude(rd => rd.Customer)
                .Include(a => a.Reservations)
                    .ThenInclude(r => r.Payments)
                .Include(a => a.Reservations)
                    .ThenInclude(r => r.FlightTime)
                .ToList();

            var result = new List<AgencyAnalyticsDto>();

            foreach (var agency in agencies)
            {
                var reservations = agency.Reservations ?? new List<Reservation>();
                var nonCancelledReservations = reservations.Where(r => r.Status != ReservationStatus.Cancelled).ToList();

                var dto = new AgencyAnalyticsDto
                {
                    AgencyId = agency.Id,
                    AgencyName = agency.Name,
                    ContactPerson = agency.ContactPerson,
                    PhoneNumber = agency.PhoneNumber,
                    Email = agency.Email,
                    Address = agency.Address,
                    TotalReservations = nonCancelledReservations.Count,
                    ConfirmedCount = reservations.Count(r => r.Status == ReservationStatus.Confirmed),
                    PendingCount = reservations.Count(r => r.Status == ReservationStatus.Pending),
                    CancelledCount = reservations.Count(r => r.Status == ReservationStatus.Cancelled),
                    TotalPassengers = nonCancelledReservations.Sum(r => r.ReservationDetails?.Count ?? 0),
                    TotalAgreedAmount = nonCancelledReservations.Sum(r => (r.AgencyPrice.HasValue && r.AgencyPrice.Value > 0) ? r.AgencyPrice.Value : r.TotalAmount),
                    TotalPaidAmount = nonCancelledReservations.Sum(r => {
                        var paymentsSum = (r.Payments != null && r.Payments.Any()) ? r.Payments.Sum(p => p.Amount) : 0;
                        if (paymentsSum > 0) return paymentsSum;
                        return r.Deposit;
                    })
                };

                dto.RemainingBalance = Math.Max(0, dto.TotalAgreedAmount - dto.TotalPaidAmount);

                foreach (var r in reservations.OrderByDescending(r => r.FlightDate))
                {
                    var agreed = (r.AgencyPrice.HasValue && r.AgencyPrice.Value > 0) ? r.AgencyPrice.Value : r.TotalAmount;
                    var paymentsSum = (r.Payments != null && r.Payments.Any()) ? r.Payments.Sum(p => p.Amount) : 0;
                    var paid = paymentsSum > 0 ? paymentsSum : r.Deposit;

                    dto.Bookings.Add(new AgencyBookingItemDto
                    {
                        ReservationId = r.Id,
                        Title = r.Title,
                        FlightDate = r.FlightDate,
                        FlightTime = r.FlightTime?.Time,
                        BilletNumber = r.BilletNumber,
                        PassengerCount = r.ReservationDetails?.Count ?? 0,
                        PassengerNames = r.ReservationDetails?.Select(d => d.Customer?.FullName ?? "Passenger").ToList() ?? new List<string>(),
                        AgreedPrice = agreed,
                        TotalAmount = r.TotalAmount,
                        PaidAmount = paid,
                        RestToPay = Math.Max(0, agreed - paid),
                        Status = (int)r.Status,
                        PreferredCurrency = (int)r.PreferredCurrency,
                        Notes = r.Notes
                    });
                }

                result.Add(dto);
            }

            return result;
        }

        public Agency GetAgencyById(int id)
        {
            return _context.Agencies.FirstOrDefault(e => e.Id == id);
        }

        public Agency AddAgency(Agency entity)
        {
            _context.Agencies.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public Agency UpdateAgency(int id, Agency entity)
        {
            _context.Agencies.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public bool DeleteAgency(int id)
        {
            var entity = GetAgencyById(id);
            if (entity != null)
            {
                _context.Agencies.Remove(entity);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
