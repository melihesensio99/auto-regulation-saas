using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DietModuleEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Calories",
                table: "DietMeals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Carbs",
                table: "DietMeals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Fats",
                table: "DietMeals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "DietMeals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Protein",
                table: "DietMeals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GeneralDietNotes",
                table: "Athletes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Calories",
                table: "DietMeals");

            migrationBuilder.DropColumn(
                name: "Carbs",
                table: "DietMeals");

            migrationBuilder.DropColumn(
                name: "Fats",
                table: "DietMeals");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "DietMeals");

            migrationBuilder.DropColumn(
                name: "Protein",
                table: "DietMeals");

            migrationBuilder.DropColumn(
                name: "GeneralDietNotes",
                table: "Athletes");
        }
    }
}
