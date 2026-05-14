using System;
using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.DTOs
{
    public class ReservationDetailDto
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public int CustomerId { get; set; }
        public int? PilotId { get; set; }
        public int FlightPackageId { get; set; }
        public int? TransportGroupId { get; set; }
        public bool WeightLimitStatus { get; set; }
        public List<int> ExtraServiceIds { get; set; } = new List<int>();
        public CustomerDtos? Customer { get; set; }

        public ReservationDetailDto() { }

        public ReservationDetailDto(ReservationDetail model)
        {
            Id = model.Id;
            ReservationId = model.ReservationId;
            CustomerId = model.CustomerId;
            PilotId = model.PilotId;
            FlightPackageId = model.FlightPackageId;
            TransportGroupId = model.TransportGroupId;
            WeightLimitStatus = model.WeightLimitStatus;
            
            if (model.ReservationExtras != null)
            {
                ExtraServiceIds = model.ReservationExtras.Select(re => re.ExtraServiceId).ToList();
            }

            if (model.Customer != null)
            {
                Customer = new CustomerDtos(model.Customer);
            }
        }
    }
}
