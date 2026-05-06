using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.FlightPackageService
{
    public interface IFlightPackageService
    {
        List<FlightPackage> GetFlightPackages();
        FlightPackage GetFlightPackageById(int id);
        FlightPackage AddFlightPackage(FlightPackageDtos dto);
        FlightPackage UpdateFlightPackage(int id, FlightPackageDtos dto);
        bool DeleteFlightPackage(int id);
    }
}