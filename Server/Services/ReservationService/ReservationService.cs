using System.Collections.Generic;
using System.Linq;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;
using ReservationSystem_backend.Repository.ReservationRepo;
using ReservationSystem_backend.Repository.FlightPackageRepo;
using ReservationSystem_backend.Repository.ExtraServiceRepo;
using ReservationSystem_backend.Repository.CustomerRepo;

namespace ReservationSystem_backend.Services.ReservationService
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepo _repo;
        private readonly IFlightPackageRepo _packageRepo;
        private readonly IExtraServiceRepo _extraRepo;
        private readonly ICustomerRepo _customerRepo;

        public ReservationService(
            IReservationRepo repo, 
            IFlightPackageRepo packageRepo, 
            IExtraServiceRepo extraRepo,
            ICustomerRepo customerRepo)
        {
            _repo = repo;
            _packageRepo = packageRepo;
            _extraRepo = extraRepo;
            _customerRepo = customerRepo;
        }

        public List<ReservationDtos> GetReservations()
        {
            var entities = _repo.GetReservations();
            var dtos = new List<ReservationDtos>();
            foreach (var entity in entities)
            {
                dtos.Add(new ReservationDtos(entity));
            }
            return dtos;
        }

        public ReservationDtos GetReservationById(int id)
        {
            var entity = _repo.GetReservationById(id);
            return entity != null ? new ReservationDtos(entity) : null;
        }

        public ReservationDtos AddReservation(ReservationDtos dto)
        {
            var entity = new Reservation
            {
                FlightDate = dto.FlightDate,
                Title = dto.Title,
                FlightTimeId = dto.FlightTimeId,
                Status = dto.Status,
                Notes = dto.Notes,
                PickupStatus = dto.PickupStatus,
                PickupLocation = dto.PickupLocation,
                IsAgencyBooking = dto.IsAgencyBooking,
                AgencyId = dto.AgencyId,
                AgencyPrice = dto.AgencyPrice,
                Deposit = dto.Deposit,
                ReservationDetails = new List<ReservationDetail>()
            };

            decimal totalAmount = 0;

            if (dto.Details != null)
            {
                foreach (var detailDto in dto.Details)
                {
                    // Handle Customer (Add or Update)
                    int customerId = detailDto.CustomerId;
                    if (detailDto.Customer != null)
                    {
                        if (customerId > 0)
                        {
                            var existingCustomer = _customerRepo.GetCustomerById(customerId);
                            if (existingCustomer != null)
                            {
                                existingCustomer.FullName = detailDto.Customer.FullName;
                                existingCustomer.PhoneNumber = detailDto.Customer.PhoneNumber ?? string.Empty;
                                existingCustomer.DateOfBirth = detailDto.Customer.DateOfBirth;
                                existingCustomer.Email = detailDto.Customer.Email;
                                existingCustomer.Country = detailDto.Customer.Country;
                                _customerRepo.UpdateCustomer(customerId, existingCustomer);
                            }
                        }
                        else
                        {
                            var newCustomer = new Customer
                            {
                                FullName = detailDto.Customer.FullName,
                                PhoneNumber = detailDto.Customer.PhoneNumber ?? string.Empty,
                                DateOfBirth = detailDto.Customer.DateOfBirth,
                                Email = detailDto.Customer.Email,
                                Country = detailDto.Customer.Country
                            };
                            var savedCustomer = _customerRepo.AddCustomer(newCustomer);
                            customerId = savedCustomer.Id;
                        }
                    }

                    var detail = new ReservationDetail
                    {
                        CustomerId = customerId,
                        PilotId = detailDto.PilotId,
                        FlightPackageId = detailDto.FlightPackageId,
                        TransportGroupId = detailDto.TransportGroupId,
                        WeightLimitStatus = detailDto.WeightLimitStatus,
                        ReservationExtras = new List<ReservationExtra>()
                    };

                    // Calculate package price
                    var pkg = _packageRepo.GetFlightPackageById(detailDto.FlightPackageId);
                    if (pkg != null) totalAmount += pkg.Price;

                    // Handle extras for this detail
                    if (detailDto.ExtraServiceIds != null)
                    {
                        foreach (var extraId in detailDto.ExtraServiceIds)
                        {
                            detail.ReservationExtras.Add(new ReservationExtra
                            {
                                ExtraServiceId = extraId
                            });

                            var extra = _extraRepo.GetExtraServiceById(extraId);
                            if (extra != null) totalAmount += extra.Price;
                        }
                    }

                    entity.ReservationDetails.Add(detail);
                }
            }

            if (entity.IsAgencyBooking && entity.AgencyPrice.HasValue)
            {
                entity.TotalAmount = entity.AgencyPrice.Value;
            }
            else
            {
                entity.TotalAmount = totalAmount;
            }

            var savedEntity = _repo.AddReservation(entity);
            return new ReservationDtos(savedEntity);
        }

        public ReservationDtos UpdateReservation(int id, ReservationDtos dto)
        {
            var existingEntity = _repo.GetReservationById(id);
            if (existingEntity != null)
            {
                existingEntity.FlightDate = dto.FlightDate;
                existingEntity.Title = dto.Title;
                existingEntity.FlightTimeId = dto.FlightTimeId;
                existingEntity.Status = dto.Status;
                existingEntity.Notes = dto.Notes;
                existingEntity.PickupStatus = dto.PickupStatus;
                existingEntity.PickupLocation = dto.PickupLocation;
                existingEntity.IsAgencyBooking = dto.IsAgencyBooking;
                existingEntity.AgencyId = dto.AgencyId;
                existingEntity.AgencyPrice = dto.AgencyPrice;
                existingEntity.Deposit = dto.Deposit;
                
                decimal totalAmount = 0;

                // Clear existing details and add new ones
                existingEntity.ReservationDetails.Clear();
                if (dto.Details != null)
                {
                    foreach (var detailDto in dto.Details)
                    {
                        // Handle Customer (Add or Update)
                        int customerId = detailDto.CustomerId;
                        if (detailDto.Customer != null)
                        {
                            if (customerId > 0)
                            {
                                var existingCustomer = _customerRepo.GetCustomerById(customerId);
                                if (existingCustomer != null)
                                {
                                    existingCustomer.FullName = detailDto.Customer.FullName;
                                    existingCustomer.PhoneNumber = detailDto.Customer.PhoneNumber ?? string.Empty;
                                    existingCustomer.DateOfBirth = detailDto.Customer.DateOfBirth;
                                    existingCustomer.Email = detailDto.Customer.Email;
                                    existingCustomer.Country = detailDto.Customer.Country;
                                    _customerRepo.UpdateCustomer(customerId, existingCustomer);
                                }
                            }
                            else
                            {
                                var newCustomer = new Customer
                                {
                                    FullName = detailDto.Customer.FullName,
                                    PhoneNumber = detailDto.Customer.PhoneNumber ?? string.Empty,
                                    DateOfBirth = detailDto.Customer.DateOfBirth,
                                    Email = detailDto.Customer.Email,
                                    Country = detailDto.Customer.Country
                                };
                                var savedCustomer = _customerRepo.AddCustomer(newCustomer);
                                customerId = savedCustomer.Id;
                            }
                        }

                        var detail = new ReservationDetail
                        {
                            CustomerId = customerId,
                            PilotId = detailDto.PilotId,
                            FlightPackageId = detailDto.FlightPackageId,
                            TransportGroupId = detailDto.TransportGroupId,
                            WeightLimitStatus = detailDto.WeightLimitStatus,
                            ReservationExtras = new List<ReservationExtra>()
                        };

                        // Calculate package price
                        var pkg = _packageRepo.GetFlightPackageById(detailDto.FlightPackageId);
                        if (pkg != null) totalAmount += pkg.Price;

                        if (detailDto.ExtraServiceIds != null)
                        {
                            foreach (var extraId in detailDto.ExtraServiceIds)
                            {
                                detail.ReservationExtras.Add(new ReservationExtra
                                {
                                    ExtraServiceId = extraId
                                });

                                var extra = _extraRepo.GetExtraServiceById(extraId);
                                if (extra != null) totalAmount += extra.Price;
                            }
                        }

                        existingEntity.ReservationDetails.Add(detail);
                    }
                }
                
                if (existingEntity.IsAgencyBooking && existingEntity.AgencyPrice.HasValue)
                {
                    existingEntity.TotalAmount = existingEntity.AgencyPrice.Value;
                }
                else
                {
                    existingEntity.TotalAmount = totalAmount;
                }

                var updatedEntity = _repo.UpdateReservation(id, existingEntity);
                return new ReservationDtos(updatedEntity);
            }
            return null;
        }

        public bool DeleteReservation(int id)
        {
            return _repo.DeleteReservation(id);
        }
    }
}