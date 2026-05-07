using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend.Models;

namespace ReservationSystem_backend
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Pilot> Pilots { get; set; } = null!;
        public DbSet<TransportGroup> TransportGroups { get; set; } = null!;
        public DbSet<Country> Countries { get; set; } = null!;
        public DbSet<FlightPackage> FlightPackages { get; set; } = null!;
        public DbSet<ExtraService> ExtraServices { get; set; } = null!;
        public DbSet<Reservation> Reservations { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<ReservationExtra> ReservationExtras { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Decimal precision
            modelBuilder.Entity<FlightPackage>()
                .Property(f => f.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<ExtraService>()
                .Property(e => e.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            // Configure Relationships

            // 1. Core Logic: Reservation -> Customer, Pilot, FlightPackage
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Customer)
                .WithMany(c => c.Reservations)
                .HasForeignKey(r => r.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Pilot)
                .WithMany(p => p.Reservations)
                .HasForeignKey(r => r.PilotId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.FlightPackage)
                .WithMany(f => f.Reservations)
                .HasForeignKey(r => r.FlightPackageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Country)
                .WithMany(co => co.Customers)
                .HasForeignKey(c => c.CountryId)
                .OnDelete(DeleteBehavior.SetNull);

            // 2. Logistics: Reservation -> TransportGroup
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.TransportGroup)
                .WithMany(t => t.Reservations)
                .HasForeignKey(r => r.TransportGroupId)
                .OnDelete(DeleteBehavior.SetNull);

            // 3. Split Payments: Reservation -> Payments (One-to-Many)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Reservation)
                .WithMany(r => r.Payments)
                .HasForeignKey(p => p.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            // 4. Extras: Reservation <-> ExtraService (Many-to-Many via ReservationExtra)
            modelBuilder.Entity<ReservationExtra>()
                .HasKey(re => new { re.ReservationId, re.ExtraServiceId });

            modelBuilder.Entity<ReservationExtra>()
                .HasOne(re => re.Reservation)
                .WithMany(r => r.ReservationExtras)
                .HasForeignKey(re => re.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReservationExtra>()
                .HasOne(re => re.ExtraService)
                .WithMany(e => e.ReservationExtras)
                .HasForeignKey(re => re.ExtraServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
