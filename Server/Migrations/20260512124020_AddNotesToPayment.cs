using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Payments",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2263), new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2280) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2283), new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2283) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2284), new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2285) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2286), new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2286) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2287), new DateTime(2026, 5, 12, 15, 40, 19, 484, DateTimeKind.Local).AddTicks(2287) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Payments");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5501), new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5518) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5522), new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5523) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5524), new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5525) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5527), new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5527) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5528), new DateTime(2026, 5, 12, 15, 7, 1, 308, DateTimeKind.Local).AddTicks(5529) });
        }
    }
}
