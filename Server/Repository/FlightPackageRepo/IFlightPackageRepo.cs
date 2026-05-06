using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.FlightPackageRepo
{
    public interface IFlightPackageRepo
    {
        List<FlightPackage> GetFlightPackages();
        FlightPackage GetFlightPackageById(int id);
        FlightPackage AddFlightPackage(FlightPackage entity);
        FlightPackage UpdateFlightPackage(int id, FlightPackage entity);
        bool DeleteFlightPackage(int id);
    }
}