using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class PerPassengerDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationExtras_Reservations_ReservationId",
                table: "ReservationExtras");

            migrationBuilder.DropColumn(
                name: "WeightLimitStatus",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "ReservationId",
                table: "ReservationExtras",
                newName: "ReservationDetailId");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "Reservations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "WeightLimitStatus",
                table: "ReservationDetails",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationExtras_ReservationDetails_ReservationDetailId",
                table: "ReservationExtras",
                column: "ReservationDetailId",
                principalTable: "ReservationDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationExtras_ReservationDetails_ReservationDetailId",
                table: "ReservationExtras");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "WeightLimitStatus",
                table: "ReservationDetails");

            migrationBuilder.RenameColumn(
                name: "ReservationDetailId",
                table: "ReservationExtras",
                newName: "ReservationId");

            migrationBuilder.AddColumn<bool>(
                name: "WeightLimitStatus",
                table: "Reservations",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationExtras_Reservations_ReservationId",
                table: "ReservationExtras",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
