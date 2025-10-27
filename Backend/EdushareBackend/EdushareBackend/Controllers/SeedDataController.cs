using System.Text;
using Data;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class SeedDataController : ControllerBase
    {
        UserManager<AppUser> userManager;
        MaterialLogic materialLogic;
        RoleManager<IdentityRole> roleManager;
        private readonly IWebHostEnvironment env;
        private RepositoryContext ctx;
        
        public SeedDataController(UserManager<AppUser> userManager, MaterialLogic materialLogic, RoleManager<IdentityRole> roleManager, IWebHostEnvironment env,  RepositoryContext ctx)
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
            
            var users = new List<AppUserRegisterDto>
            {
                new AppUserRegisterDto
                {
                    Email = "molnar.tamas@example.com",
                    FirstName = "Tamás",
                    LastName = "Molnár",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "kiss.evelin@example.com",
                    FirstName = "Evelin",
                    LastName = "Kiss",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "toth.milan@example.com",
                    FirstName = "Milán",
                    LastName = "Tóth",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "szabo.reka@example.com",
                    FirstName = "Réka",
                    LastName = "Szabó",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "kovacs.gabor@example.com",
                    FirstName = "Gábor",
                    LastName = "Kovács",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "nagy.lili@example.com",
                    FirstName = "Lili",
                    LastName = "Nagy",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "balogh.istvan@example.com",
                    FirstName = "István",
                    LastName = "Balogh",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "szalai.viktoria@example.com",
                    FirstName = "Viktória",
                    LastName = "Szalai",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "varga.gergo@example.com",
                    FirstName = "Gergő",
                    LastName = "Varga",
                    Password = "123123123"
                },
                new AppUserRegisterDto
                {
                    Email = "horvath.zsofia@example.com",
                    FirstName = "Zsófia",
                    LastName = "Horváth",
                    Password = "123123123"
                }
            };

            foreach (var dto in users)
            {
                var user = new AppUser();
                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;
                user.UserName = dto.Email.Split('@')[0];
                user.Email = dto.Email;

                var defaultImagePath = Path.Combine(env.WebRootPath, "images", "default.png"); //kép betöltése

                var fileBytes = await System.IO.File.ReadAllBytesAsync(defaultImagePath);

                user.Image = new FileContent("default.png", fileBytes);

                await userManager.CreateAsync(user, dto.Password);

                if (userManager.Users.Count() == 1)
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }
            
            var seedPdfpath = Path.Combine(env.WebRootPath, "SeedData", "sample.pdf");
            
            byte[] pdfFileBytes = System.IO.File.ReadAllBytes(seedPdfpath);
            
            string pdfBase64 = Convert.ToBase64String(pdfFileBytes);
            
            var materials = new List<MaterialCreateUpdateDto>
            {
                new MaterialCreateUpdateDto
                {
                    Title = "Bevezetés a programozásba",
                    Description = "Alapfogalmak és első lépések C# nyelven.",
                    Subject = "Informatika",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "bevezetes_programozas.pdf",
                        File = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("Bevezetés a programozásba PDF tartalom"))
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Adatbázis-kezelés alapjai",
                    Description = "Relációs adatbázisok és SQL alapfogalmak.",
                    Subject = "Adatbázis",
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
                    Subject = "Hálózatok",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "halozati_protokollok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Algoritmusok és adatszerkezetek",
                    Description = "Listák, verem, sor, fa, gráf alapok.",
                    Subject = "Informatika",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "algoritmusok_adatszerkezetek.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Operációs rendszerek működése",
                    Description = "Processzek, memóriakezelés, fájlrendszerek.",
                    Subject = "Informatika",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "operacios_rendszerek.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Webfejlesztés alapjai",
                    Description = "HTML, CSS és JavaScript bevezetés.",
                    Subject = "Webfejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "webfejlesztes_alapjai.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Angular komponensek",
                    Description = "Angular komponensstruktúra és adatátadás.",
                    Subject = "Webfejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "angular_komponensek.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "ASP.NET Core bevezetés",
                    Description = "MVC minta és alap API készítés.",
                    Subject = "Backend fejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "aspnetcore_bevezetes.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Entity Framework alapok",
                    Description = "Adatbázis-kezelés C# alkalmazásokban.",
                    Subject = "Adatbázis",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "entity_framework_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "LINQ használata",
                    Description = "Lekérdezések és adatszűrés C#-ban.",
                    Subject = "C#",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "linq_hasznalata.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Git és verziókezelés",
                    Description = "Git parancsok, branch kezelés, merge.",
                    Subject = "Fejlesztési eszközök",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "git_verziokezeles.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Szoftvertervezési minták",
                    Description = "Singleton, Factory, Repository minták.",
                    Subject = "Szoftvertervezés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "szoftvertervezesi_mintak.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "REST API tervezés",
                    Description = "HTTP metódusok, státuszkódok és jó gyakorlatok.",
                    Subject = "Backend fejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "rest_api_tervezes.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Docker alapok",
                    Description = "Konténerek, image-ek és Docker Compose.",
                    Subject = "DevOps",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "docker_alapok.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Unit tesztelés C#-ban",
                    Description = "xUnit, NUnit és tesztelési elvek.",
                    Subject = "Tesztelés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "unit_teszteles.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "SignalR valós idejű kommunikáció",
                    Description = "Chat és élő frissítések ASP.NET-ben.",
                    Subject = "Backend fejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "signalr_valos_ido.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "Angular routing",
                    Description = "Navigáció, route paraméterek és guard-ok.",
                    Subject = "Webfejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "angular_routing.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "JWT autentikáció",
                    Description = "Token alapú beléptetés ASP.NET-ben.",
                    Subject = "Biztonság",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "jwt_autentikacio.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "HTTP kliens használata Angularban",
                    Description = "GET, POST, PUT, DELETE műveletek példákkal.",
                    Subject = "Webfejlesztés",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "angular_http_client.pdf",
                        File = pdfBase64
                    }
                },
                new MaterialCreateUpdateDto
                {
                    Title = "CI/CD bevezetés",
                    Description = "GitHub Actions és automatizált build folyamat.",
                    Subject = "DevOps",
                    Content = new ContentCreateUpdateDto
                    {
                        FileName = "cicd_bevezetes.pdf",
                        File = pdfBase64
                    }
                }
            };



            var user1 = await userManager.FindByEmailAsync("molnar.tamas@example.com");
            var user2 = await userManager.FindByEmailAsync("kiss.evelin@example.com");
            var user3 = await userManager.FindByEmailAsync("kovacs.gabor@example.com");
            
            var random =  new Random();
            var uploaders = new[]  { user1, user2, user3 };

            foreach (var material in materials)
            {
                var uploader = uploaders[random.Next(0, uploaders.Length)];
                
                materialLogic.AddMaterial(material, uploader.Id);
            }

            return Ok();
        }
    }