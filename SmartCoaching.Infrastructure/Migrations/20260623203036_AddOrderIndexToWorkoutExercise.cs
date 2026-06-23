using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderIndexToWorkoutExercise : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "WorkoutExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "WorkoutExercises");
        }
    }
}
