using Data;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.Subject;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
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
        private readonly SubjectLogic subjectLogic;
        private readonly Repository<Subject> subjectRepo;

        public SeedDataController(
            UserManager<AppUser> userManager,
            MaterialLogic materialLogic,
            SubjectLogic subjectLogic,
            RoleManager<IdentityRole> roleManager,
            IWebHostEnvironment env,
            RepositoryContext ctx,
            Repository<Subject> subjectRepo)
        {
            this.userManager = userManager;
            this.materialLogic = materialLogic;
            this.subjectLogic = subjectLogic;
            this.roleManager = roleManager;
            this.env = env;
            this.ctx = ctx;
            this.subjectRepo = subjectRepo;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
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
            var subjects = new List<SubjectCreateDto>
            {
                new SubjectCreateDto { Name = "Informatika", Semester = 1, Credit=4},
                new SubjectCreateDto { Name = "Adatbázis", Semester = 2, Credit = 4 },
                new SubjectCreateDto { Name = "Hálózatok", Semester = 3, Credit = 4 },
                new SubjectCreateDto { Name = "Webfejlesztés", Semester = 2 , Credit = 6},
                new SubjectCreateDto { Name = "Backend fejlesztés", Semester = 3 , Credit = 5},
                new SubjectCreateDto { Name = "C#", Semester = 1 , Credit = 3},
                new SubjectCreateDto { Name = "Fejlesztési eszközök", Semester = 4 , Credit = 2},
                new SubjectCreateDto { Name = "Szoftvertervezés", Semester = 5 , Credit = 5 },
                new SubjectCreateDto { Name = "DevOps", Semester = 6 , Credit = 5},
                new SubjectCreateDto { Name = "Tesztelés", Semester = 5 , Credit = 3},
                new SubjectCreateDto { Name = "Biztonság", Semester = 6 , Credit = 3}
            };

            var subjectDictionary = new Dictionary<string, string>();

            foreach (var subject in subjects)
            {
                subjectLogic.AddSubject(subject);
                subjectDictionary.Add(subject.Name, subjectRepo.GetAll().FirstOrDefault(s => s.Name == subject.Name)!.Id);
            }

            var materials = new List<MaterialCreateUpdateDto>
            {
                new MaterialCreateUpdateDto
                {
                    Title = "Bevezetés a programozásba",
                    Description = "Az alapvető programozási fogalmak C# nyelven.",
                    SubjectId = subjectDictionary["Informatika"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "bevezetes_programozas.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Adatbázis-kezelés alapjai",
                    Description = "Relációs adatbázisok, kulcsok és SQL alapok.",
                    SubjectId = subjectDictionary["Adatbázis"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "adatbazis_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Hálózati protokollok és topológiák",
                    Description = "A TCP/IP modell és a leggyakoribb hálózati topológiák bemutatása.",
                    SubjectId = subjectDictionary["Hálózatok"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "halozati_protokollok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Webfejlesztés alapjai",
                    Description = "HTML5, CSS3 és JavaScript rövid áttekintése példákkal.",
                    SubjectId = subjectDictionary["Webfejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "webfejlesztes_alapjai.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Entity Framework alapok",
                    Description = "Adatbázis-kezelés .NET alkalmazásokban ORM segítségével.",
                    SubjectId = subjectDictionary["Backend fejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "entity_framework_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Git és verziókezelés",
                    Description = "Branch-ek, merge, pull request és repository-kezelés.",
                    SubjectId = subjectDictionary["Fejlesztési eszközök"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "git_verziokezeles.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "C# haladó szintaxis",
                    Description = "LINQ, async/await, lambda kifejezések és interface-ek.",
                    SubjectId = subjectDictionary["C#"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "csharp_halado.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Szoftvertervezési minták",
                    Description = "Ismert tervezési minták: Singleton, Factory, Repository.",
                    SubjectId = subjectDictionary["Szoftvertervezés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "szoftvertervezes_mintak.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Tesztelés alapjai",
                    Description = "Unit tesztek, mocking és integrációs tesztelés .NET környezetben.",
                    SubjectId = subjectDictionary["Tesztelés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "teszteles_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Web API fejlesztés ASP.NET-ben",
                    Description = "RESTful API készítése, controller-ek és DTO-k használata.",
                    SubjectId = subjectDictionary["Backend fejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "webapi_fejlesztes.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Adatbázis normalizálás",
                    Description = "1NF, 2NF, 3NF és BCNF szabályok áttekintése példákkal.",
                    SubjectId = subjectDictionary["Adatbázis"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "adatbazis_normalizalas.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Angular bevezetés",
                    Description = "Komponensek, adatkötés és routing alapok Angular keretrendszerben.",
                    SubjectId = subjectDictionary["Webfejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "angular_bevezetes.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "DevOps és CI/CD alapok",
                    Description = "Automatizált build, tesztelés és deploy pipeline-ok ismertetése.",
                    SubjectId = subjectDictionary["DevOps"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "devops_cicd.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Biztonság az alkalmazásfejlesztésben",
                    Description = "Jelszókezelés, token alapú autentikáció és input validáció.",
                    SubjectId = subjectDictionary["Biztonság"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "biztonsag_alkalmazasfejlesztesben.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Szoftverfejlesztési életciklus",
                    Description = "A szoftverfejlesztés fázisai: igényfelmérés, tervezés, implementáció, tesztelés, karbantartás.",
                    SubjectId = subjectDictionary["Szoftvertervezés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "szoftverfejlesztes_eletciklus.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Algoritmusok és adatszerkezetek",
                    Description = "Listák, verem, sor, bináris fa és rendezési algoritmusok bemutatása.",
                    SubjectId = subjectDictionary["Informatika"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "algoritmusok_adatszerkezetek.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "HTTP és REST architektúra",
                    Description = "A HTTP protokoll működése, metódusok és RESTful elvek.",
                    SubjectId = subjectDictionary["Hálózatok"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "http_rest_architektura.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "CSS Grid és Flexbox",
                    Description = "Modern layout technikák részletes bemutatása példákkal.",
                    SubjectId = subjectDictionary["Webfejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "css_grid_flexbox.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "ASP.NET Identity alapok",
                    Description = "Felhasználókezelés, role-ok és autentikáció ASP.NET Core-ban.",
                    SubjectId = subjectDictionary["Backend fejlesztés"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "aspnet_identity.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Docker használata fejlesztéshez",
                    Description = "Konténerizáció, Dockerfile és Docker Compose bemutatása .NET projekthez.",
                    SubjectId = subjectDictionary["DevOps"],
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "docker_hasznalata.pdf",
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

