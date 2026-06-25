using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOnboardingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SupplementUsage",
                table: "Athletes",
                newName: "TrainingHistory");

            migrationBuilder.RenameColumn(
                name: "Lifestyle",
                table: "Athletes",
                newName: "ShortTermGoal");

            migrationBuilder.RenameColumn(
                name: "InjuryHistory",
                table: "Athletes",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Goals",
                table: "Athletes",
                newName: "OutsidePhysicalActivity");

            migrationBuilder.RenameColumn(
                name: "DietaryPreferences",
                table: "Athletes",
                newName: "Occupation");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalNotes",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentTrainingRoutine",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Expectations",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HasTrackedMacros",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HasWorkedWithCoach",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HearAboutUs",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LongTermGoal",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MainReason",
                table: "Athletes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalNotes",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "CurrentTrainingRoutine",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "Expectations",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "HasTrackedMacros",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "HasWorkedWithCoach",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "HearAboutUs",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "LongTermGoal",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "MainReason",
                table: "Athletes");

            migrationBuilder.RenameColumn(
                name: "TrainingHistory",
                table: "Athletes",
                newName: "SupplementUsage");

            migrationBuilder.RenameColumn(
                name: "ShortTermGoal",
                table: "Athletes",
                newName: "Lifestyle");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Athletes",
                newName: "InjuryHistory");

            migrationBuilder.RenameColumn(
                name: "OutsidePhysicalActivity",
                table: "Athletes",
                newName: "Goals");

            migrationBuilder.RenameColumn(
                name: "Occupation",
                table: "Athletes",
                newName: "DietaryPreferences");
        }
    }
}
