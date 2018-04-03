using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MorFriesland.Data.Migrations
{
    public partial class klaas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Bronhouder",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Bronhouder",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
