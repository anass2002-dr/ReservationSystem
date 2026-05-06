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

    public enum PaymentCurrency
    {
        TL,
        USD,
        EUR
    }

    public enum PaymentMethod
    {
        Cash,
        Card
    }
}
