using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class CleanupFlightTimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7581), new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7597) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7601), new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7601) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7603), new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7603) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7605), new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7605) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7607), new DateTime(2026, 5, 12, 12, 0, 52, 620, DateTimeKind.Local).AddTicks(7607) });
        }
    }
}
