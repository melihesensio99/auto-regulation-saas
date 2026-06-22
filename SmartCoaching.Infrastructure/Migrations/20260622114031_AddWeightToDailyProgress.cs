using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeightToDailyProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "WeightKg",
                table: "DailyProgresses",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeightKg",
                table: "DailyProgresses");
        }
    }
}
