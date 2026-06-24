using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OnboardingEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "StartingWeightKg",
                table: "Athletes",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "HeightCm",
                table: "Athletes",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Athletes",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<string>(
                name: "DietaryPreferences",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Goals",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InjuryHistory",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOnboardingCompleted",
                table: "Athletes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastProgramNotificationSentAt",
                table: "Athletes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Lifestyle",
                table: "Athletes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplementUsage",
                table: "Athletes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietaryPreferences",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "Goals",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "InjuryHistory",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "IsOnboardingCompleted",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "LastProgramNotificationSentAt",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "Lifestyle",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "SupplementUsage",
                table: "Athletes");

            migrationBuilder.AlterColumn<double>(
                name: "StartingWeightKg",
                table: "Athletes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "HeightCm",
                table: "Athletes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Athletes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
