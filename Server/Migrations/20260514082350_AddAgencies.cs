using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAgencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AgencyId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AgencyPrice",
                table: "Reservations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAgencyBooking",
                table: "Reservations",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Agencies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ContactPerson = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agencies", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3803), new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3813) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3816), new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3816) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3817), new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3818) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3819), new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3819) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3820), new DateTime(2026, 5, 14, 11, 23, 50, 178, DateTimeKind.Local).AddTicks(3820) });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_AgencyId",
                table: "Reservations",
                column: "AgencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Agencies_AgencyId",
                table: "Reservations",
                column: "AgencyId",
                principalTable: "Agencies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Agencies_AgencyId",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "Agencies");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_AgencyId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "AgencyId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "AgencyPrice",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "IsAgencyBooking",
                table: "Reservations");

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7173), new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7195) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7199), new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7200) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7202), new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7202) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7203), new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7204) });

            migrationBuilder.UpdateData(
                table: "FlightTimes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7205), new DateTime(2026, 5, 13, 13, 23, 53, 426, DateTimeKind.Local).AddTicks(7206) });
        }
    }
}
