using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend.Models;
using System.Security.Claims;

namespace ReservationSystem_backend
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Pilot> Pilots { get; set; } = null!;
        public DbSet<PilotGroup> PilotGroups { get; set; } = null!;
        public DbSet<TransportGroup> TransportGroups { get; set; } = null!;

        public DbSet<FlightPackage> FlightPackages { get; set; } = null!;
        public DbSet<ExtraService> ExtraServices { get; set; } = null!;
        public DbSet<Reservation> Reservations { get; set; } = null!;
        public DbSet<ReservationDetail> ReservationDetails { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<ReservationExtra> ReservationExtras { get; set; } = null!;
        public DbSet<FlightTime> FlightTimes { get; set; } = null!;
        public DbSet<Agency> Agencies { get; set; } = null!;

        public override int SaveChanges()
        {
            ApplyAuditInfo();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInfo();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInfo()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            var userId = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            foreach (var entityEntry in entries)
            {
                var entity = (BaseEntity)entityEntry.Entity;

                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                    entity.CreatedBy = userId ?? "System";
                }
                else
                {
                    Entry(entity).Property(x => x.CreatedAt).IsModified = false;
                    Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                }

                entity.UpdatedAt = DateTime.UtcNow;
                entity.UpdatedBy = userId ?? "System";
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // ... (rest of the config)

            // Seed initial Flight Times
            modelBuilder.Entity<FlightTime>().HasData(
                new FlightTime { Id = 1, Time = "08:30", IsActive = true },
                new FlightTime { Id = 2, Time = "10:30", IsActive = true },
                new FlightTime { Id = 3, Time = "13:00", IsActive = true },
                new FlightTime { Id = 4, Time = "15:00", IsActive = true },
                new FlightTime { Id = 5, Time = "17:00", IsActive = true }
            );

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

            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Reservation>()
                .Property(r => r.AgencyPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Reservation>()
                .Property(r => r.Deposit)
                .HasColumnType("decimal(18,2)");

            // Configure Relationships

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.FlightTime)
                .WithMany(ft => ft.Reservations)
                .HasForeignKey(r => r.FlightTimeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Agency)
                .WithMany(a => a.Reservations)
                .HasForeignKey(r => r.AgencyId)
                .OnDelete(DeleteBehavior.SetNull);

            // 1. Core Logic: ReservationDetail -> Customer, Pilot, FlightPackage, Reservation
            modelBuilder.Entity<ReservationDetail>()
                .HasOne(rd => rd.Reservation)
                .WithMany(r => r.ReservationDetails)
                .HasForeignKey(rd => rd.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReservationDetail>()
                .HasOne(rd => rd.Customer)
                .WithMany(c => c.ReservationDetails)
                .HasForeignKey(rd => rd.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReservationDetail>()
                .HasOne(rd => rd.Pilot)
                .WithMany(p => p.ReservationDetails)
                .HasForeignKey(rd => rd.PilotId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReservationDetail>()
                .HasOne(rd => rd.FlightPackage)
                .WithMany(f => f.ReservationDetails)
                .HasForeignKey(rd => rd.FlightPackageId)
                .OnDelete(DeleteBehavior.Restrict);



            // 2. Logistics: ReservationDetail -> TransportGroup
            modelBuilder.Entity<ReservationDetail>()
                .HasOne(rd => rd.TransportGroup)
                .WithMany(t => t.ReservationDetails)
                .HasForeignKey(rd => rd.TransportGroupId)
                .OnDelete(DeleteBehavior.SetNull);

            // 3. Split Payments: Reservation -> Payments (One-to-Many)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Reservation)
                .WithMany(r => r.Payments)
                .HasForeignKey(p => p.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            // 4. Extras: ReservationDetail <-> ExtraService (Many-to-Many via ReservationExtra)
            modelBuilder.Entity<ReservationExtra>()
                .HasKey(re => new { re.ReservationDetailId, re.ExtraServiceId });

            modelBuilder.Entity<ReservationExtra>()
                .HasOne(re => re.ReservationDetail)
                .WithMany(rd => rd.ReservationExtras)
                .HasForeignKey(re => re.ReservationDetailId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReservationExtra>()
                .HasOne(re => re.ExtraService)
                .WithMany(e => e.ReservationExtras)
                .HasForeignKey(re => re.ExtraServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Pilot>()
                .HasOne(p => p.PilotGroup)
                .WithMany(pg => pg.Pilots)
                .HasForeignKey(p => p.PilotGroupId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
