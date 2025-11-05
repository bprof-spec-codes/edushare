using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EdushareBackend.Controllers;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MockQueryable.Moq;

namespace BackendNUnitTests
{
    [TestFixture]
    public class UserControllerTests
    {
        private Mock<UserManager<AppUser>> _userManagerMock;
        private Mock<RoleManager<IdentityRole>> _roleManagerMock;
        private Mock<IWebHostEnvironment> _envMock;
        private Mock<IOptions<JwtSettings>> _jwtSettingsMock;
        private UserController _controller;

        [SetUp]
        public void Setup()
        {
            _userManagerMock = MockUserManager();
            _roleManagerMock = MockRoleManager();
            _envMock = new Mock<IWebHostEnvironment>();
            _jwtSettingsMock = new Mock<IOptions<JwtSettings>>();

            _jwtSettingsMock.Setup(j => j.Value).Returns(new JwtSettings
            {
                Issuer = "TestIssuer",
                Key = "SuperSecretJWTKeyForUnitTesting1234"
            });

            _controller = new UserController(
                _userManagerMock.Object,
                _envMock.Object,
                _roleManagerMock.Object,
                _jwtSettingsMock.Object
            );
        }

        private static Mock<UserManager<AppUser>> MockUserManager()
        {
            var store = new Mock<IUserStore<AppUser>>();
            return new Mock<UserManager<AppUser>>(
                store.Object, null, null, null, null, null, null, null, null);
        }

        private static Mock<RoleManager<IdentityRole>> MockRoleManager()
        {
            var store = new Mock<IRoleStore<IdentityRole>>();
            return new Mock<RoleManager<IdentityRole>>(
                store.Object, null, null, null, null);
        }

        // ---------- REGISTER TESTS ----------

        [Test]
        public void RegisterUser_Should_ThrowException_WhenPasswordTooShort()
        {
            var dto = new AppUserRegisterDto
            {
                Email = "test@example.com",
                Password = "123",
                FirstName = "Test",
                LastName = "User"
            };

            var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
                await _controller.RegisterUser(dto));

            Assert.That(ex.Message, Is.EqualTo("A jelszónak legalább 8 karakter hosszúnak kell lennie"));
        }

        [Test]
        public void RegisterUser_Should_ThrowException_WhenEmailInvalid()
        {
            var dto = new AppUserRegisterDto
            {
                Email = "invalidemail",
                Password = "validpassword",
                FirstName = "Test",
                LastName = "User"
            };

            var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
                await _controller.RegisterUser(dto));

            Assert.That(ex.Message, Is.EqualTo("Az email cím formátuma nem megfelelő"));
        }

        [Test]
        public async Task RegisterUser_Should_CreateUserSuccessfully()
        {
            var dto = new AppUserRegisterDto
            {
                Email = "test@example.com",
                Password = "validpassword",
                FirstName = "John",
                LastName = "Doe"
            };

            _userManagerMock.Setup(u => u.FindByEmailAsync(dto.Email))
                .ReturnsAsync((AppUser)null);

            _userManagerMock.Setup(u => u.CreateAsync(It.IsAny<AppUser>(), dto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock.Setup(u => u.Users)
                .Returns(new List<AppUser>().AsQueryable());

            // Platformfüggetlen temp könyvtár
            var tempPath = Path.Combine(Path.GetTempPath(), "images");

            // Mock beállítása
            _envMock.Setup(e => e.WebRootPath).Returns(tempPath);

            // Könyvtár létrehozása, ha nem létezik
            Directory.CreateDirectory(tempPath);

            // Tesztfájl létrehozása
            var filePath = Path.Combine(tempPath, "default.png");
            File.WriteAllBytes(filePath, new byte[1]);


            Assert.DoesNotThrowAsync(async () => await _controller.RegisterUser(dto));
        }

        // ---------- LOGIN TESTS ----------

        [Test]
        public async Task Login_Should_ReturnBadRequest_WhenEmailNotFound()
        {
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((AppUser)null);

            var dto = new AppUserLoginDto
            {
                Email = "missing@example.com",
                Password = "password123"
            };

            var result = await _controller.Login(dto);

            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest.Value.ToString(), Does.Contain("Incorrect Email"));
        }

        [Test]
        public async Task Login_Should_ReturnBadRequest_WhenPasswordIncorrect()
        {
            var fakeUser = new AppUser { Email = "user@example.com", UserName = "user" };

            _userManagerMock.Setup(u => u.FindByEmailAsync(fakeUser.Email))
                .ReturnsAsync(fakeUser);

            _userManagerMock.Setup(u => u.CheckPasswordAsync(fakeUser, "wrongpassword"))
                .ReturnsAsync(false);

            var dto = new AppUserLoginDto
            {
                Email = fakeUser.Email,
                Password = "wrongpassword"
            };

            var result = await _controller.Login(dto);

            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Login_Should_ReturnToken_WhenCredentialsValid()
        {
            var fakeUser = new AppUser { Id = "1", Email = "user@example.com", UserName = "user" };

            _userManagerMock.Setup(u => u.FindByEmailAsync(fakeUser.Email))
                .ReturnsAsync(fakeUser);

            _userManagerMock.Setup(u => u.CheckPasswordAsync(fakeUser, "password123"))
                .ReturnsAsync(true);

            _userManagerMock.Setup(u => u.GetRolesAsync(fakeUser))
                .ReturnsAsync(new List<string> { "User" });

            var dto = new AppUserLoginDto
            {
                Email = fakeUser.Email,
                Password = "password123"
            };

            var result = await _controller.Login(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var ok = result as OkObjectResult;
            var data = ok.Value as LoginResultDto;
            Assert.That(data.Token, Is.Not.Null);
        }

        // ---------- GET USER ----------

       /* [Test]
        public async Task GetUserById_Should_ReturnNotFound_WhenUserDoesNotExist()
        {
            _userManagerMock.Setup(u => u.Users)
                .Returns(new List<AppUser>().AsQueryable());

            var result = await _controller.GetUserById("missing");

            Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
        }
       */

        /*[Test]
        public async Task GetUserById_Should_ReturnUser_WhenExists()
        {
            //Arrange
            var user = new AppUser
            {
                Id = "1",
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Image = new FileContent("test.png", new byte[] { 1, 2, 3 }),
                Materials = new List<Material>
                {
                    new Material { Id = Guid.NewGuid().ToString(), Title = "Math Notes", Subject = "Math" }
                }
            };

            _userManagerMock.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);

            // Act
            var result = await _controller.GetUserById("1");

            // Assert
            Assert.That(result.Value, Is.Not.Null);
            Assert.That(result.Value.Id, Is.EqualTo("1"));
            Assert.That(result.Value.FullName, Is.EqualTo("John Doe"));
            Assert.That(result.Value.Email, Is.EqualTo("john@example.com"));
            Assert.That(result.Value.Materials.Count, Is.EqualTo(1));

        }

        */

        // ---------- UPDATE USER ----------

       /* [Test]
        public void UpdateUser_Should_Throw_WhenUnauthorized()
        {
            var user = new AppUser
            {
                Id = "1",
                Email = "john@example.com",
                FirstName = "John",
                LastName = "Doe",
                Image = new FileContent("test.png", new byte[] { 1 })
            };

            _userManagerMock.Setup(u => u.Users)
                .Returns(new List<AppUser> { user }.AsQueryable());

            var dto = new AppUserUpdateDto { Email = "new@example.com", FirstName = "New", LastName = "Name" };

            Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await _controller.UpdateUser("1", dto));
        }
       */

        // ---------- DELETE USER ----------

        [Test]
        public async Task DeleteUserById_Should_Throw_WhenUnauthorized()
        {
            // Arrange
            var currentUserId = "11111111-1111-1111-1111-111111111111"; // a bejelentkezett user
            var targetUserId = "22222222-2222-2222-2222-222222222222"; // a t�r�lni k�v�nt user

            // Mockolt ClaimsPrincipal � m�s user pr�b�l t�r�lni
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, currentUserId)
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act + Assert
            Assert.ThrowsAsync<UnauthorizedAccessException>(
                async () => await _controller.DeleteUserById(targetUserId));
        }

        // ---------- ROLES ----------

        [Test]
        public async Task GrantAdminRole_Should_Throw_WhenUserNotFound()
        {
            _userManagerMock.Setup(u => u.FindByIdAsync("1")).ReturnsAsync((AppUser)null);
            Assert.ThrowsAsync<ArgumentException>(async () => await _controller.GrantAdminRole("1"));
        }

        [Test]
        public async Task GrantTeacherRole_Should_CreateRoleIfNotExists()
        {
            var user = new AppUser { Id = "1", Email = "teacher@example.com" };

            _userManagerMock.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            _roleManagerMock.Setup(r => r.RoleExistsAsync("Teacher")).ReturnsAsync(false);
            _roleManagerMock.Setup(r => r.CreateAsync(It.IsAny<IdentityRole>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(u => u.AddToRoleAsync(user, "Teacher")).ReturnsAsync(IdentityResult.Success);

            Assert.DoesNotThrowAsync(async () => await _controller.GrantTeacherRole("1"));
        }

        [Test]
        public async Task RevokeRole_Should_Throw_WhenLastAdmin()
        {
            var user = new AppUser { Id = "1", Email = "admin@example.com" };

            _userManagerMock.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            _userManagerMock.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Admin" });
            _userManagerMock.Setup(u => u.GetUsersInRoleAsync("Admin")).ReturnsAsync(new List<AppUser> { user });

            var ex = Assert.ThrowsAsync<ArgumentException>(async () => await _controller.RevokeRole("1"));
            Assert.That(ex.Message, Does.Contain("You cannot remove the last remaining Admin user"));
        }
    }
}