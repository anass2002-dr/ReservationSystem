using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPickupDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PickupLocation",
                table: "Reservations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "PickupStatus",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4383), new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4401) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4404), new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4405) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4406), new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4407) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4408), new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4408) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4410), new DateTime(2026, 5, 12, 14, 43, 14, 615, DateTimeKind.Local).AddTicks(4410) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PickupLocation",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PickupStatus",
                table: "Reservations");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(414), new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(434) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(438), new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(439) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(440), new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(441) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(442), new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(442) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(444), new DateTime(2026, 5, 12, 13, 41, 33, 813, DateTimeKind.Local).AddTicks(444) });
        }
    }
}
