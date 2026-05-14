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
        TL,
        USD,
        EUR,
        GBP
    }

    public enum PaymentMethod
    {
        Cash,
        Card
    }
}
