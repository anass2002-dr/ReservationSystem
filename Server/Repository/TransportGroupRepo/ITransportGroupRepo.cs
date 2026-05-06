using System.Collections.Generic;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend.Repository.TransportGroupRepo
{
    public interface ITransportGroupRepo
    {
        List<TransportGroup> GetTransportGroups();
        TransportGroup GetTransportGroupById(int id);
        TransportGroup AddTransportGroup(TransportGroup entity);
        TransportGroup UpdateTransportGroup(int id, TransportGroup entity);
        bool DeleteTransportGroup(int id);
    }
}