using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class ReservationDetailsStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Customers_CustomerId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_FlightPackages_FlightPackageId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Pilots_PilotId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_TransportGroups_TransportGroupId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_CustomerId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_FlightPackageId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_PilotId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_TransportGroupId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "FlightPackageId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PilotId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TransportGroupId",
                table: "Reservations");

            migrationBuilder.CreateTable(
                name: "ReservationDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    PilotId = table.Column<int>(type: "int", nullable: false),
                    FlightPackageId = table.Column<int>(type: "int", nullable: false),
                    TransportGroupId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationDetails_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationDetails_FlightPackages_FlightPackageId",
                        column: x => x.FlightPackageId,
                        principalTable: "FlightPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationDetails_Pilots_PilotId",
                        column: x => x.PilotId,
                        principalTable: "Pilots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationDetails_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationDetails_TransportGroups_TransportGroupId",
                        column: x => x.TransportGroupId,
                        principalTable: "TransportGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationDetails_CustomerId",
                table: "ReservationDetails",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationDetails_FlightPackageId",
                table: "ReservationDetails",
                column: "FlightPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationDetails_PilotId",
                table: "ReservationDetails",
                column: "PilotId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationDetails_ReservationId",
                table: "ReservationDetails",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationDetails_TransportGroupId",
                table: "ReservationDetails",
                column: "TransportGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservationDetails");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FlightPackageId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PilotId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TransportGroupId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_CustomerId",
                table: "Reservations",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_FlightPackageId",
                table: "Reservations",
                column: "FlightPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_PilotId",
                table: "Reservations",
                column: "PilotId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_TransportGroupId",
                table: "Reservations",
                column: "TransportGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Customers_CustomerId",
                table: "Reservations",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_FlightPackages_FlightPackageId",
                table: "Reservations",
                column: "FlightPackageId",
                principalTable: "FlightPackages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Pilots_PilotId",
                table: "Reservations",
                column: "PilotId",
                principalTable: "Pilots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_TransportGroups_TransportGroupId",
                table: "Reservations",
                column: "TransportGroupId",
                principalTable: "TransportGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
