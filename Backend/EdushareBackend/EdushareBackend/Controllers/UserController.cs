using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;

        public UserController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public IEnumerable<AppUserShortViewDto> GetAllUsers()
        {
            var user = new AppUserShortViewDto
            {
                Id = "123123-1231431-1234134",
                Email = "test@email.com",
                FullName = "UserName",
                Image = new ContentViewDto("imageId", "imageTitle", "imageInBase64")
            };

            return new List<AppUserShortViewDto>() { user };
        }

        [HttpGet("{id}")]
        public AppUserViewDto GetUserById(string id)
        {
            return new AppUserViewDto
            {
                Id = id,
                Email = "test@email.com",
                FullName = "UserName",
                Image = new ContentViewDto("imageId", "imageTitle", "imageInBase64"),
                Materials = new List<MaterialAppUserShortViewDto>() { 
                    new MaterialAppUserShortViewDto
                    {
                        Id = "materialId",
                        Title = "MaterialTitle",
                        UploadDate = DateTime.Now
                    }
                }
            };
        }

        [HttpPost("Register")]
        public async Task RegisterUser(AppUserRegisterDto dto)
        {
            var user = new AppUser();
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.UserName = dto.Email.Split('@')[0];
            user.Email = dto.Email;

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
