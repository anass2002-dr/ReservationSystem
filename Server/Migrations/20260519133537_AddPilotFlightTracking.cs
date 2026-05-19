using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPilotFlightTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PilotAttendance",
                table: "ReservationDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PilotNote",
                table: "ReservationDetails",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "FlightsAssigned",
                table: "Pilots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FlightsFlown",
                table: "Pilots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 13, 35, 34, 138, DateTimeKind.Utc).AddTicks(322));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 13, 35, 34, 138, DateTimeKind.Utc).AddTicks(1182));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 13, 35, 34, 138, DateTimeKind.Utc).AddTicks(1184));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 13, 35, 34, 138, DateTimeKind.Utc).AddTicks(1185));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 13, 35, 34, 138, DateTimeKind.Utc).AddTicks(1186));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PilotAttendance",
                table: "ReservationDetails");

            migrationBuilder.DropColumn(
                name: "PilotNote",
                table: "ReservationDetails");

            migrationBuilder.DropColumn(
                name: "FlightsAssigned",
                table: "Pilots");

            migrationBuilder.DropColumn(
                name: "FlightsFlown",
                table: "Pilots");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 17, 11, 52, 14, 679, DateTimeKind.Utc).AddTicks(251));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 17, 11, 52, 14, 679, DateTimeKind.Utc).AddTicks(1426));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 17, 11, 52, 14, 679, DateTimeKind.Utc).AddTicks(1428));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 17, 11, 52, 14, 679, DateTimeKind.Utc).AddTicks(1429));

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 17, 11, 52, 14, 679, DateTimeKind.Utc).AddTicks(1430));
        }
    }
}
