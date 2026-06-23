using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAiAnalysisFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AiAnalysis",
                table: "WeeklyCheckIns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsWorkoutCompleted",
                table: "DailyProgresses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiAnalysis",
                table: "WeeklyCheckIns");

            migrationBuilder.DropColumn(
                name: "IsWorkoutCompleted",
                table: "DailyProgresses");
        }
    }
}
