/*using System.Text;
using Data;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedDataController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly MaterialLogic materialLogic;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IWebHostEnvironment env;
        private readonly RepositoryContext ctx;

        public SeedDataController(
            UserManager<AppUser> userManager,
            MaterialLogic materialLogic,
            RoleManager<IdentityRole> roleManager,
            IWebHostEnvironment env,
            RepositoryContext ctx)
        {
            this.userManager = userManager;
            this.materialLogic = materialLogic;
            this.roleManager = roleManager;
            this.env = env;
            this.ctx = ctx;
        }

        [HttpPost]
        public async Task<IActionResult> LoadSeedData()
        {
            ctx.Database.EnsureDeleted();
            ctx.Database.EnsureCreated();

            // --- FELHASZNÁLÓK ---
            var users = new List<AppUserRegisterDto>
            {
                new AppUserRegisterDto { Email = "molnar.tamas@example.com", FirstName = "Tamás", LastName = "Molnár", Password = "123123123" },
                new AppUserRegisterDto { Email = "kiss.evelin@example.com", FirstName = "Evelin", LastName = "Kiss", Password = "123123123" },
                new AppUserRegisterDto { Email = "toth.milan@example.com", FirstName = "Milán", LastName = "Tóth", Password = "123123123" },
                new AppUserRegisterDto { Email = "szabo.reka@example.com", FirstName = "Réka", LastName = "Szabó", Password = "123123123" },
                new AppUserRegisterDto { Email = "kovacs.gabor@example.com", FirstName = "Gábor", LastName = "Kovács", Password = "123123123" },
                new AppUserRegisterDto { Email = "nagy.lili@example.com", FirstName = "Lili", LastName = "Nagy", Password = "123123123" },
                new AppUserRegisterDto { Email = "balogh.istvan@example.com", FirstName = "István", LastName = "Balogh", Password = "123123123" },
                new AppUserRegisterDto { Email = "szalai.viktoria@example.com", FirstName = "Viktória", LastName = "Szalai", Password = "123123123" },
                new AppUserRegisterDto { Email = "varga.gergo@example.com", FirstName = "Gergő", LastName = "Varga", Password = "123123123" },
                new AppUserRegisterDto { Email = "horvath.zsofia@example.com", FirstName = "Zsófia", LastName = "Horváth", Password = "123123123" }
            };

            foreach (var dto in users)
            {
                var user = new AppUser
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    UserName = dto.Email.Split('@')[0],
                    Email = dto.Email
                };

                var defaultImagePath = Path.Combine(env.WebRootPath, "images", "default.png");
                var fileBytes = await System.IO.File.ReadAllBytesAsync(defaultImagePath);
                user.Image = new FileContent("default.png", fileBytes);

                await userManager.CreateAsync(user, dto.Password);

                if (userManager.Users.Count() == 1)
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }

            // --- ANYAGOK ---
            var seedPdfpath = Path.Combine(env.WebRootPath, "SeedData", "sample.pdf");
            byte[] pdfFileBytes = System.IO.File.ReadAllBytes(seedPdfpath);
            string pdfBase64 = Convert.ToBase64String(pdfFileBytes);

            // Közös subject példányok (hogy ne legyen duplikált az adatbázisban)
            var subjects = new Dictionary<string, Subject>
            {
                ["Informatika"] = new Subject { Name = "Informatika", Semester = 1 },
                ["Adatbázis"] = new Subject { Name = "Adatbázis", Semester = 2 },
                ["Hálózatok"] = new Subject { Name = "Hálózatok", Semester = 3 },
                ["Webfejlesztés"] = new Subject { Name = "Webfejlesztés", Semester = 2 },
                ["Backend fejlesztés"] = new Subject { Name = "Backend fejlesztés", Semester = 3 },
                ["C#"] = new Subject { Name = "C#", Semester = 1 },
                ["Fejlesztési eszközök"] = new Subject { Name = "Fejlesztési eszközök", Semester = 4 },
                ["Szoftvertervezés"] = new Subject { Name = "Szoftvertervezés", Semester = 5 },
                ["DevOps"] = new Subject { Name = "DevOps", Semester = 6 },
                ["Tesztelés"] = new Subject { Name = "Tesztelés", Semester = 5 },
                ["Biztonság"] = new Subject { Name = "Biztonság", Semester = 6 }
            };

            var materials = new List<MaterialCreateUpdateDto>
            {
                new MaterialCreateUpdateDto
                {
                    Title = "Bevezetés a programozásba",
                    Description = "Alapfogalmak és első lépések C# nyelven.",
                    Subject = subjects["Informatika"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "bevezetes_programozas.pdf",
                        File = Convert.ToBase64String(Encoding.UTF8.GetBytes("Bevezetés a programozásba PDF tartalom"))
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Adatbázis-kezelés alapjai",
                    Description = "Relációs adatbázisok és SQL alapfogalmak.",
                    Subject = subjects["Adatbázis"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "adatbazis_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Hálózati protokollok",
                    Description = "TCP/IP és HTTP működése.",
                    Subject = subjects["Hálózatok"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "halozati_protokollok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Webfejlesztés alapjai",
                    Description = "HTML, CSS és JavaScript bevezetés.",
                    Subject = subjects["Webfejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "webfejlesztes_alapjai.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Entity Framework alapok",
                    Description = "Adatbázis-kezelés C# alkalmazásokban.",
                    Subject = subjects["Adatbázis"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "entity_framework_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Git és verziókezelés",
                    Description = "Git parancsok, branch kezelés, merge.",
                    Subject = subjects["Fejlesztési eszközök"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "git_verziokezeles.pdf",
                        File = pdfBase64
                    }
                }
            };

            // --- FELTÖLTŐK ---
            var user1 = await userManager.FindByEmailAsync("molnar.tamas@example.com");
            var user2 = await userManager.FindByEmailAsync("kiss.evelin@example.com");
            var user3 = await userManager.FindByEmailAsync("kovacs.gabor@example.com");

            var random = new Random();
            var uploaders = new[] { user1, user2, user3 };

            foreach (var material in materials)
            {
                var uploader = uploaders[random.Next(0, uploaders.Length)];
                materialLogic.AddMaterial(material, uploader.Id);
            }

            return Ok("Seed adatok sikeresen betöltve.");
        }
    }
}
*/
