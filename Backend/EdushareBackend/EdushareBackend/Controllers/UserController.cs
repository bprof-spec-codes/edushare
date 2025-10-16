using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Text;
using Data;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;
        RoleManager<IdentityRole> roleManager;
        private readonly IWebHostEnvironment env;
       

        public UserController(UserManager<AppUser> userManager, IWebHostEnvironment env, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.env = env;
            this.roleManager = roleManager;
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

                Materials = user.Materials?.Select(m => new MaterialViewDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Subject = m.Subject,
                    UploadDate = m.UploadDate
                }).ToList() ?? new List<MaterialViewDto>() //ha a materilas null akkor üres lista
            };

            return userView;

        }

        [HttpPost("Register")]
        public async Task RegisterUser(AppUserRegisterDto dto)
        {
            if (dto.Password.Length < 8) throw new ArgumentException("A jelszónak legalább 8 karakter hosszúnak kell lennie");

            if (await userManager.FindByEmailAsync(dto.Email) != null) throw new ArgumentException("Az emalcím már létezik");

            if (!(IsValidEmail(dto.Email))) throw new ArgumentException("Az email cím formátuma nem megfelelő");

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
        public async Task<IActionResult> Login(AppUserLoginDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Incorrect Email" });
            }
            else
            {
                var result = await userManager.CheckPasswordAsync(user, dto.Password);
                if (!result)
                {
                    return BadRequest(new { message = "Incorrect Password" });
                }
                else
                {
                    //todo: generate token
                    var claim = new List<Claim>();
                    claim.Add(new Claim(ClaimTypes.Name, user.UserName!));
                    claim.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));

                    foreach (var role in await userManager.GetRolesAsync(user))
                    {
                        claim.Add(new Claim(ClaimTypes.Role, role));
                    }

                    int expiryInMinutes = 24 * 60;
                    var token = GenerateAccessToken(claim, expiryInMinutes);

                    return Ok(new LoginResultDto()
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(token),
                        Expiration = DateTime.Now.AddMinutes(expiryInMinutes)
                    });

                }
            }



        }

        [HttpPut("{id}")]
        //[Authorize] Admin / Own Profile
        public async Task UpdateUser(string id,[FromBody] AppUserUpdateDto dto)
        {
            var currentUser = await userManager.Users
                .Include(u => u.Image)
                .FirstOrDefaultAsync(u => u.Id == id);

             currentUser.Email = dto.Email;
             currentUser.FirstName = dto.FirstName;
             currentUser.LastName = dto.LastName;
             if (dto.Image != null)
             {
                 currentUser.Image.FileName = dto.Image.FileName;
                 currentUser.Image.File = Convert.FromBase64String(dto.Image.File);
             }

            await userManager.SetEmailAsync(currentUser, dto.Email);
            await userManager.UpdateAsync(currentUser);

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
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");
            await userManager.AddToRoleAsync(user, "Admin");
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


        private JwtSecurityToken GenerateAccessToken(IEnumerable<Claim>? claims, int expiryInMinutes)
        {
            var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes("jhsddsfjkhdsfhksfjdsdsfdsgdsfsfdhjsfdhjsfdjsjsffdsdfsdfsdfhdsfhdskhf54465g6dsgúdsg4dsdggsdglsdj4oiietrjhsddsfjkhdsfhksfjdsdsfdsgdsfsfdhjsfdhjsfdjsjsffdsdfsdfsdfhdsfhdskhf54465g6dsgúdsg4dsdggsdglsdj4oiietrjhsddsfjkhdsfhksfjdsdsfdsgdsfsfdhjsfdhjsfdjsjsffdsdfsdfsdfhdsfhdskhf54465g6dsgúdsg4dsdggsdglsdj4oiietr"));

            return new JwtSecurityToken(
                  issuer: "edushare.com",
                  audience: "edushare.com",
                  claims: claims?.ToArray(),
                  expires: DateTime.Now.AddMinutes(expiryInMinutes),
                  signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
            );
        }

        private bool IsValidEmail(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }
    }
}
