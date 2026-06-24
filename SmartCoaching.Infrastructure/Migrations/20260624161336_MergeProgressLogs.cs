using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MergeProgressLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyProgresses");

            migrationBuilder.DropTable(
                name: "WeeklyCheckIns");

            migrationBuilder.CreateTable(
                name: "ProgressLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AthleteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConsumedCalories = table.Column<decimal>(type: "numeric", nullable: false),
                    TakenSteps = table.Column<int>(type: "integer", nullable: false),
                    IsWorkoutCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    WeightKg = table.Column<double>(type: "double precision", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    FrontPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    BackPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    SidePhotoUrl = table.Column<string>(type: "text", nullable: true),
                    CoachFeedback = table.Column<string>(type: "text", nullable: true),
                    AiAnalysis = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgressLogs_Athletes_AthleteId",
                        column: x => x.AthleteId,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLogs_AthleteId",
                table: "ProgressLogs",
                column: "AthleteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProgressLogs");

            migrationBuilder.CreateTable(
                name: "DailyProgresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AthleteId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConsumedCalories = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsWorkoutCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    TakenSteps = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    WeightKg = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyProgresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyProgresses_Athletes_AthleteId",
                        column: x => x.AthleteId,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeeklyCheckIns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AthleteId = table.Column<Guid>(type: "uuid", nullable: false),
                    AiAnalysis = table.Column<string>(type: "text", nullable: true),
                    BackPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    CoachFeedback = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FrontPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    SidePhotoUrl = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    WeightKg = table.Column<decimal>(type: "numeric", nullable: false)
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
                name: "IX_DailyProgresses_AthleteId",
                table: "DailyProgresses",
                column: "AthleteId");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyCheckIns_AthleteId",
                table: "WeeklyCheckIns",
                column: "AthleteId");
        }
    }
}
