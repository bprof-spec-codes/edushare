using Entities.Dtos.Material;
using Entities.Dtos.User;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<AppUserShortViewDto> GetAllUsers()
        {
            var user = new AppUserShortViewDto
            {
                Id = "123123-1231431-1234134",
                Email = "test@email.com",
                FullName = "UserName",
                Image = null
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
                Image = null,
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
        public void RegisterUser(AppUserRegisterDto dto)
        {

        }

        [HttpPost("Login")]
        public string LoginUser(AppUserLoginDto dto)
        {
            return "token";
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
