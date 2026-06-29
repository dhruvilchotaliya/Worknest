using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Worknest.Infrastructure.Data
{
    /// <inheritdoc />
    public partial class Added_technicalskills_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ExperienceInYears",
                table: "Employees",
                type: "numeric",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TechSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechSkills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeTechSkill",
                columns: table => new
                {
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnicalSkillsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeTechSkill", x => new { x.EmployeeId, x.TechnicalSkillsId });
                    table.ForeignKey(
                        name: "FK_EmployeeTechSkill_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeTechSkill_TechSkills_TechnicalSkillsId",
                        column: x => x.TechnicalSkillsId,
                        principalTable: "TechSkills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeTechSkill_TechnicalSkillsId",
                table: "EmployeeTechSkill",
                column: "TechnicalSkillsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmployeeTechSkill");

            migrationBuilder.DropTable(
                name: "TechSkills");

            migrationBuilder.DropColumn(
                name: "ExperienceInYears",
                table: "Employees");
        }
    }
}
