using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFlightTimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS FlightTimes;");
            // migrationBuilder.Sql("ALTER TABLE Reservations DROP COLUMN IF EXISTS FlightTimeId;");
            migrationBuilder.CreateTable(
                name: "FlightTimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Time = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightTimes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "FlightTimes",
                columns: new[] { "Id", "CreatedAt", "IsActive", "Time", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, DateTime.Now, true, "08:30", DateTime.Now },
                    { 2, DateTime.Now, true, "10:30", DateTime.Now },
                    { 3, DateTime.Now, true, "13:00", DateTime.Now },
                    { 4, DateTime.Now, true, "15:00", DateTime.Now },
                    { 5, DateTime.Now, true, "17:00", DateTime.Now }
                });

            migrationBuilder.AddColumn<int>(
                name: "FlightTimeId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_FlightTimeId",
                table: "Reservations",
                column: "FlightTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_FlightTimes_FlightTimeId",
                table: "Reservations",
                column: "FlightTimeId",
                principalTable: "FlightTimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_FlightTimes_FlightTimeId",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "FlightTimes");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_FlightTimeId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "FlightTimeId",
                table: "Reservations");
        }
    }
}
