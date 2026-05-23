using System;
using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class ReservationDtos
    {
        public int Id { get; set; }
        public DateTime FlightDate { get; set; }
        public string? Title { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentCurrency PreferredCurrency { get; set; }
        public decimal Deposit { get; set; }
        public PaymentMethod? DepositMethod { get; set; }
        public int FlightTimeId { get; set; }
        public string? FlightTime { get; set; }
        public ReservationStatus Status { get; set; }
        public string? Notes { get; set; }
        public PickupStatus PickupStatus { get; set; }
        public string? PickupLocation { get; set; }
        
        public bool IsAgencyBooking { get; set; }
        public int? AgencyId { get; set; }
        public string? AgencyName { get; set; }
        public decimal? AgencyPrice { get; set; }
        
        public List<ReservationDetailDto> Details { get; set; } = new List<ReservationDetailDto>();
        public List<ReservationPhotoDto> Photos { get; set; } = new List<ReservationPhotoDto>();

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }

        public ReservationDtos() { }

        public ReservationDtos(Reservation model)
        {
            Id = model.Id;
            FlightDate = model.FlightDate;
            Title = model.Title;
            TotalAmount = model.TotalAmount;
            PreferredCurrency = model.PreferredCurrency;
            Deposit = model.Deposit;
            DepositMethod = model.DepositMethod;
            FlightTimeId = model.FlightTimeId;
            FlightTime = model.FlightTime?.Time;
            Status = model.Status;
            Notes = model.Notes;
            PickupStatus = model.PickupStatus;
            PickupLocation = model.PickupLocation;
            IsAgencyBooking = model.IsAgencyBooking;
            AgencyId = model.AgencyId;
            AgencyName = model.Agency?.Name;
            AgencyPrice = model.AgencyPrice;

            CreatedAt = model.CreatedAt;
            UpdatedAt = model.UpdatedAt;
            CreatedBy = model.CreatedBy;
            UpdatedBy = model.UpdatedBy;

            if (model.ReservationDetails != null)
            {
                foreach (var detail in model.ReservationDetails)
                {
                    Details.Add(new ReservationDetailDto(detail));
                }
            }

            if (model.ReservationPhotos != null)
            {
                foreach (var photo in model.ReservationPhotos)
                {
                    Photos.Add(new ReservationPhotoDto
                    {
                        Id = photo.Id,
                        ReservationId = photo.ReservationId,
                        PhotoData = photo.PhotoData,
                        FileName = photo.FileName,
                        ContentType = photo.ContentType
                    });
                }
            }
        }
    }
}