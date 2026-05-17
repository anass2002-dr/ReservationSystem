namespace ReservationSystem_backend.Models
{
    public enum PilotStatus
    {
        Active,
        InFlight,
        OffDuty
    }

    public enum ReservationStatus
    {
        Pending,
        Confirmed,
        Cancelled
    }

    public enum PickupStatus
    {
        NotRequired,
        Pending,
        PickedUp,
        NoShow
    }

    public enum PaymentCurrency
    {
        TL = 0,
        USD = 1,
        EUR = 2,
        GBP = 3
    }

    public enum PaymentMethod
    {
        Cash = 0,
        Card = 1,
        Transfer = 2
    }
}
