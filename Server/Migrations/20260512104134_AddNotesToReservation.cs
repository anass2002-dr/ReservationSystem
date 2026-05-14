using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Reservations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Reservations");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7342), new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7360) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7364), new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7364) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7366), new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7366) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7367), new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7368) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7369), new DateTime(2026, 5, 12, 13, 26, 49, 444, DateTimeKind.Local).AddTicks(7369) });
        }
    }
}
