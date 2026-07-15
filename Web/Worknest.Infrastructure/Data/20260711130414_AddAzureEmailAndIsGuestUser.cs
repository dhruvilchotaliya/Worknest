using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Worknest.Infrastructure.Data
{
    /// <inheritdoc />
    public partial class AddAzureEmailAndIsGuestUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AzureEmail",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsGuestUser",
                table: "Employees",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AzureEmail",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "IsGuestUser",
                table: "Employees");
        }
    }
}
