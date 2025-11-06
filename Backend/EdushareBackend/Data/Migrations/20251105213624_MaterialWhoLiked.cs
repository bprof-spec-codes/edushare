using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class MaterialWhoLiked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "AppUserFavouriteMaterials",
                columns: table => new
                {
                    FavouriteMaterialsId = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    UsersWhoFavouritedId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserFavouriteMaterials", x => new { x.FavouriteMaterialsId, x.UsersWhoFavouritedId });
                    table.ForeignKey(
                        name: "FK_AppUserFavouriteMaterials_AspNetUsers_UsersWhoFavouritedId",
                        column: x => x.UsersWhoFavouritedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserFavouriteMaterials_Materials_FavouriteMaterialsId",
                        column: x => x.FavouriteMaterialsId,
                        principalTable: "Materials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFavouriteMaterials_UsersWhoFavouritedId",
                table: "AppUserFavouriteMaterials",
                column: "UsersWhoFavouritedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserFavouriteMaterials");

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
    }
}
