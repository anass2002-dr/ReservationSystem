using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTitleToReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Reservations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Reservations");

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
    }
}
