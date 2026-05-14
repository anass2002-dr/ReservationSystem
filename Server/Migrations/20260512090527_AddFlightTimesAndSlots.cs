using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFlightTimesAndSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6836), new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6851) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6856), new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6856) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6858), new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6858) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6859), new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6859) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6861), new DateTime(2026, 5, 12, 12, 5, 27, 235, DateTimeKind.Local).AddTicks(6861) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8145), new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8182) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8185), new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8185) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8186), new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8187) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8188), new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8188) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8189), new DateTime(2026, 5, 12, 12, 2, 20, 288, DateTimeKind.Local).AddTicks(8189) });
        }
    }
}
