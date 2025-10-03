using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;
        private readonly IWebHostEnvironment env;

        public UserController(UserManager<AppUser> userManager, IWebHostEnvironment env)
        {
            this.userManager = userManager;
            this.env = env;
        }

        [HttpGet]
        public async Task<IEnumerable<AppUserShortViewDto>> GetAllUsers()
        {
            var users = await userManager.Users //összes user listázása
                .Include(u => u.Image)  //include a navigation property miatt kell hogy az is benne legyen
                .ToListAsync();

            return users.Select(u => new AppUserShortViewDto //átalakítás DTO-vá
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FirstName + " " + u.LastName,
                Image = new ContentViewDto(
                    u.Image.Id,
                    u.Image.FileName,
                    Convert.ToBase64String(u.Image.File)
                  )
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUserViewDto>> GetUserById(string id)
        {
            var user = await userManager.Users
                .Include(u => u.Image)
                .Include(u => u.Materials)
                .FirstOrDefaultAsync(u => u.Id == id); //id alapján keresés (első találat de elv. nem is lehet több)

            if (user is null) return NotFound("User Not Found"); //hiba ha nincs találat

            var userView = new AppUserViewDto //átalakítás DTO-vá
            {
                Id = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Image = new ContentViewDto(
                    user.Image.Id,
                    user.Image.FileName,
                    Convert.ToBase64String(user.Image.File)
                ),
            
                Materials = user.Materials?.Select(m => new MaterialAppUserShortViewDto 
                {
                    Id = m.Id,
                    Title = m.Title,
                    UploadDate = m.UploadDate
                }).ToList() ?? new List<MaterialAppUserShortViewDto>() //ha a materilas null akkor üres lista
            };

            return userView;

        }

        [HttpPost("Register")]
        public async Task RegisterUser(AppUserRegisterDto dto)
        {
            var user = new AppUser();
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.UserName = dto.Email.Split('@')[0];
            user.Email = dto.Email;

            var defaultImagePath = Path.Combine(env.WebRootPath, "images", "default.png"); //kép betöltése

            var fileBytes = await System.IO.File.ReadAllBytesAsync(defaultImagePath);

            user.Image = new FileContent("default.png", fileBytes);

            var result = await userManager.CreateAsync(user, dto.Password);

        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginUser(AppUserLoginDto dto)
        {
            return Ok(new LoginResultDto() 
            {
                Token = "tokenHere",
                Expiration = DateTime.Now.AddHours(1)
            });
        }

        [HttpPut("{id}")]
        //[Authorize] Admin / Own Profile
        public void UpdateUser(string id, [FromBody] AppUserUpdateDto dto)
        {

        }

        [HttpDelete("{id}")]
        //[Authorize] Admin / Own Profile
        public void DeleteUserById(string id)
        {

        }

        [HttpGet("GrantAdmin/{userId}")]
        //[Authorize] Admin
        public async Task GrantAdminRole(string userId)
        {

        }

        [HttpGet("GrantTeacher/{userId}")]
        //[Authorize] Admin
        public async Task GrantTeacherRole(string userId)
        {

        }

        [HttpGet("RevokeRole/{userId}")]
        //[Authorize] Admin
        public async Task RevokeRole(string userId)
        {

        }
    }
}
