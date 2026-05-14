using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationSystem_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPilotGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PilotGroupId",
                table: "Pilots",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PilotGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PilotGroups", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateIndex(
                name: "IX_Pilots_PilotGroupId",
                table: "Pilots",
                column: "PilotGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pilots_PilotGroups_PilotGroupId",
                table: "Pilots",
                column: "PilotGroupId",
                principalTable: "PilotGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pilots_PilotGroups_PilotGroupId",
                table: "Pilots");

            migrationBuilder.DropTable(
                name: "PilotGroups");

            migrationBuilder.DropIndex(
                name: "IX_Pilots_PilotGroupId",
                table: "Pilots");

            migrationBuilder.DropColumn(
                name: "PilotGroupId",
                table: "Pilots");

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
    }
}
