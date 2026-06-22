using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCoaching.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAthleteAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "HeightCm",
                table: "Athletes",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Athletes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Athletes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "StartingWeightKg",
                table: "Athletes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "StartingWeightKg",
                table: "Athletes");

            migrationBuilder.AlterColumn<int>(
                name: "HeightCm",
                table: "Athletes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");
        }
    }
}
