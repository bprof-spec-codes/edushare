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
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Logic.Helper;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;
        RoleManager<IdentityRole> roleManager;
        Repository<AppUser> appuserRepo;
        ImageCompressor imageCompressor;
        private readonly IWebHostEnvironment env;
        private readonly JwtSettings jwtSettings;


        public UserController(UserManager<AppUser> userManager, IWebHostEnvironment env, RoleManager<IdentityRole> roleManager, IOptions<JwtSettings> jwtSettings, Repository<AppUser> appuserRepo, ImageCompressor imageCompressor)
        {
            this.userManager = userManager;
            this.env = env;
            this.roleManager = roleManager;
            this.jwtSettings = jwtSettings.Value;
            this.appuserRepo = appuserRepo;
            this.imageCompressor = imageCompressor;
        }

        [HttpGet]
        public async Task<IEnumerable<AppUserShortViewDto>> GetAllUsers()
        {
            var users = await userManager.Users //összes user listázása
                .Include(u => u.Image)  //include a navigation property miatt kell hogy az is benne legyen
                .ToListAsync();
            
            var result = new List<AppUserShortViewDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                
                result.Add(new AppUserShortViewDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FirstName + " " + user.LastName,
                    IsWarned = user.IsWarned,
                    IsBanned = user.IsBanned,
                    Role = roles.FirstOrDefault(),
                    Image = new ContentViewDto(
                        user.Image.Id,
                        user.Image.FileName,
                        Convert.ToBase64String(user.Image.File)
                    )
                });
            }
            
            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUserViewDto>> GetUserById(string id)
        {
            var user = await userManager.Users
                .Include(u => u.Image)
                .Include(u => u.Materials)
                !.ThenInclude(m => m.Subject )
                .FirstOrDefaultAsync(u => u.Id == id); //id alapján keresés (első találat de elv. nem is lehet több)

            if (user is null) return NotFound("User Not Found"); //hiba ha nincs találat

            var userView = new AppUserViewDto //átalakítás DTO-vá
            {
                Id = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                IsWarned = user.IsWarned,
                IsBanned = user.IsBanned,
                WarnedAt = user.WarnedAt,
                BannedAt = user.BannedAt,
                Image = new ContentViewDto(
                    user.Image.Id,
                    user.Image.FileName,
                    Convert.ToBase64String(user.Image.File)
                ),

                Materials = user.Materials?.Select(m => new MaterialShortViewDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Subject = m.Subject,
                    IsRecommended = m.IsRecommended,
                    Uploader = new AppUserMaterialShortViewDto
                    {
                        Id = user.Id,
                        FullName = $"{user.FirstName} {user.LastName}",
                        Image = new ContentViewDto(
                            user.Image.Id,
                            user.Image.FileName,
                            Convert.ToBase64String(user.Image.File)
                        )


                    },
                    UploadDate = m.UploadDate,

                    //todo Content
                }).ToList() ?? new List<MaterialShortViewDto>() //ha a materilas null akkor üres lista
            };

            return userView;

        }

        [HttpPost("Register")]
        public async Task RegisterUser(AppUserRegisterDto dto)
        {
            if (dto.Password.Length < 8) throw new ArgumentException("A jelszónak legalább 8 karakter hosszúnak kell lennie");

            if (await userManager.FindByEmailAsync(dto.Email) != null) throw new ArgumentException("Az email cím már létezik");

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

            if (userManager.Users.Count() == 1)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await userManager.AddToRoleAsync(user, "Admin");
            }

        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(AppUserLoginDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Incorrect Email" });
            }

            // Check if user is banned
            if (user.IsBanned)
            {
                return Unauthorized(new { message = "Your account has been banned. Please contact support." });
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
        [Authorize] 
        public async Task UpdateUser(string id, [FromBody] AppUserUpdateDto dto)
        {
            var currentUser = await userManager.Users
                .Include(u => u.Image)
                .FirstOrDefaultAsync(u => u.Id == id);

            if(dto.Image != null)
            {
                dto.Image.File = await imageCompressor.CompressToTargetSyieAsync(dto.Image.File);
            }
            
            currentUser.Email = dto.Email;
            currentUser.FirstName = dto.FirstName;
            currentUser.LastName = dto.LastName;
            if (dto.Image != null)
            {
                currentUser.Image.FileName = dto.Image.FileName;
                currentUser.Image.File = Convert.FromBase64String(dto.Image.File);
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != currentUser.Id)
            {
                throw new UnauthorizedAccessException("You are not allowed to do this");
            }

            await userManager.SetEmailAsync(currentUser, dto.Email);
            await userManager.UpdateAsync(currentUser);

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task DeleteUserById(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != id)
            {
                throw new UnauthorizedAccessException("You are not allowed to do this");
            }
            await userManager.DeleteAsync(await userManager.FindByIdAsync(id));
        }

        [HttpGet("GrantAdmin/{userId}")]
        //[Authorize] Admin
        public async Task GrantAdminRole(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");
            
            var roles =  await userManager.GetRolesAsync(user);

            if (roles.FirstOrDefault() == "Admin")
            {
                throw new ArgumentException("User already has admin role");
            }
            
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, "Admin");
        }

        [HttpGet("GrantTeacher/{userId}")]
        //[Authorize] Admin
        public async Task GrantTeacherRole(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            var roleExsists = await roleManager.RoleExistsAsync("Teacher");

            if (!(roleExsists))
            {
                await roleManager.CreateAsync(new IdentityRole("Teacher"));
            }
            
            var roles = await userManager.GetRolesAsync(user);

            if (roles.FirstOrDefault() == "Teacher")
            {
                throw new ArgumentException("User already has teacher role");
            }

            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, "Teacher");
        }

        [HttpGet("RevokeRole/{userId}")]
        //[Authorize] Admin
        public async Task RevokeRole(string userId)
        {

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            var roles = await userManager.GetRolesAsync(user);

            if(roles.Contains("Admin"))
            {
                var admins = await userManager.GetUsersInRoleAsync("Admin");

                if (admins.Count <= 1) throw new ArgumentException("You cannot remove the last remaining Admin user");
            }     

            if (roles is null)
            {
                throw new ArgumentException("User has no roles");
            }
            
            await userManager.RemoveFromRolesAsync(user, roles);
        }

        [HttpGet("GetUploaders")]
        public async Task<IEnumerable<AppUserToSelectUploader>> GetAllUsersWhoUploaded()
        {
           var uploaders = await appuserRepo.GetAll()
                .Where(u => u.Materials != null && u.Materials.Any()).ToListAsync();

           return uploaders.Select(u => new AppUserToSelectUploader
           {
               Id = u.Id,
               FullName = $"{u.FirstName} {u.LastName}"
           });


        }


        private JwtSecurityToken GenerateAccessToken(IEnumerable<Claim>? claims, int expiryInMinutes)
        {
            var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(jwtSettings.Key));

            return new JwtSecurityToken(
                  issuer: jwtSettings.Issuer,
                  audience: jwtSettings.Issuer,
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

        [HttpPost("Warn/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> WarnUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsWarned = true;
            user.WarnedAt = DateTime.UtcNow;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to warn user" });
            }
            return Ok(new { message = "User warned successfully" });
        }

        [HttpPost("RemoveWarning/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveWarning(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsWarned = false;
            user.WarnedAt = null;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to remove warning" });
            }
            return Ok(new { message = "Warning removed successfully" });
        }

        [HttpPost("Ban/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BanUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == userId)
            {
                return BadRequest(new { message = "You cannot ban yourself" });
            }

            user.IsBanned = true;
            user.BannedAt = DateTime.UtcNow;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to ban user" });
            }
            return Ok(new { message = "User banned successfully" });
        }

        [HttpPost("Unban/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnbanUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsBanned = false;
            user.BannedAt = null;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to unban user" });
            }
            return Ok(new { message = "User unbanned successfully" });
        }
    }
}
