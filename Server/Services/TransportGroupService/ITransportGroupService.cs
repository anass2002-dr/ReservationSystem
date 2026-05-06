using System.Collections.Generic;
using ReservationSystem_backend.Models;
using ReservationSystem_backend.DTOs;

namespace ReservationSystem_backend.Services.TransportGroupService
{
    public interface ITransportGroupService
    {
        List<TransportGroup> GetTransportGroups();
        TransportGroup GetTransportGroupById(int id);
        TransportGroup AddTransportGroup(TransportGroupDtos dto);
        TransportGroup UpdateTransportGroup(int id, TransportGroupDtos dto);
        bool DeleteTransportGroup(int id);
    }
}