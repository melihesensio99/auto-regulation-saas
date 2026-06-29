using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseLibraryToWorkoutExercise : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExerciseLibraryId",
                table: "WorkoutExercises",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExercises_ExerciseLibraryId",
                table: "WorkoutExercises",
                column: "ExerciseLibraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutExercises_ExerciseLibraries_ExerciseLibraryId",
                table: "WorkoutExercises",
                column: "ExerciseLibraryId",
                principalTable: "ExerciseLibraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutExercises_ExerciseLibraries_ExerciseLibraryId",
                table: "WorkoutExercises");

            migrationBuilder.DropIndex(
                name: "IX_WorkoutExercises_ExerciseLibraryId",
                table: "WorkoutExercises");

            migrationBuilder.DropColumn(
                name: "ExerciseLibraryId",
                table: "WorkoutExercises");
        }
    }
}
