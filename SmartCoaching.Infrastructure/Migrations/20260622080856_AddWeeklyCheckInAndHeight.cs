using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeeklyCheckInAndHeight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeightCm",
                table: "Athletes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "WeeklyCheckIns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AthleteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    WeightKg = table.Column<decimal>(type: "numeric", nullable: false),
                    FrontPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    BackPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    SidePhotoUrl = table.Column<string>(type: "text", nullable: true),
                    CoachFeedback = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyCheckIns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeeklyCheckIns_Athletes_AthleteId",
                        column: x => x.AthleteId,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyCheckIns_AthleteId",
                table: "WeeklyCheckIns",
                column: "AthleteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeeklyCheckIns");

            migrationBuilder.DropColumn(
                name: "HeightCm",
                table: "Athletes");
        }
    }
}
