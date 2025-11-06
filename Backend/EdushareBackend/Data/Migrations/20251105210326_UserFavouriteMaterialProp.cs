using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UserFavouriteMaterialProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Materials",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Materials_AppUserId",
                table: "Materials",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Materials_AspNetUsers_AppUserId",
                table: "Materials",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Materials_AspNetUsers_AppUserId",
                table: "Materials");

            migrationBuilder.DropIndex(
                name: "IX_Materials_AppUserId",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Materials");
        }
    }
}
