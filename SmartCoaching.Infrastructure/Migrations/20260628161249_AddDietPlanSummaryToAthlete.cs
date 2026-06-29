using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDietPlanSummaryToAthlete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DietPlanCalculatedAt",
                table: "Athletes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DietPlanCalories",
                table: "Athletes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DietPlanCarbs",
                table: "Athletes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DietPlanFats",
                table: "Athletes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DietPlanProtein",
                table: "Athletes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietPlanCalculatedAt",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "DietPlanCalories",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "DietPlanCarbs",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "DietPlanFats",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "DietPlanProtein",
                table: "Athletes");
        }
    }
}
