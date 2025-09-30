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
        public AppUserShortViewDto GetUserById(string id)
        {
            return new AppUserShortViewDto
            {
                Id = id,
                Email = "test@email.com",
                FullName = "UserName",
                Image = null
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
        public void UpdateUser(string id, [FromBody] AppUserUpdateDto dto)
        {

        }

        [HttpDelete("{id}")]
        public void DeleteUserById(string id)
        {

        }

        [HttpGet("GrantAdmin/{userId}")]
        public async Task GrantAdminRole(string userId)
        {

        }

        [HttpGet("GrantTeacher/{userId}")]
        public async Task GrantTeacherRole(string userId)
        {

        }

        [HttpGet("RevokeRole/{userId}")]
        public async Task RevokeRole(string userId)
        {

        }
    }
}
