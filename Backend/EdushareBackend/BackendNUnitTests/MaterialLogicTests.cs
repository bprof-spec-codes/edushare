using AutoMapper;
using Data;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendNUnitTests
{
    [TestFixture]
    public class MaterialLogicTests
    {
        private Mock<Repository<Material>> materialRepoMock;
        private Mock<Repository<AppUser>> appuserRepoMock;
        private Mock<DtoProviders> dtoProviderMock;
        private MaterialLogic logic;
        private Mock<UserManager<AppUser>> _userManagerMock;
        private Mock<Repository<Subject>> subjectRepoMock;

        [SetUp]
        public void Setup()
        {
            materialRepoMock = new Mock<Repository<Material>>();
            appuserRepoMock = new Mock<Repository<AppUser>>();
            dtoProviderMock = new Mock<DtoProviders>(null!);
            _userManagerMock = new Mock<UserManager<AppUser>>();
            subjectRepoMock = new Mock<Repository<Subject>>();
            var usermanagerMock = new Mock<UserManager<AppUser>>();
            logic = new MaterialLogic(materialRepoMock.Object, dtoProviderMock.Object, appuserRepoMock.Object, subjectRepoMock.Object, usermanagerMock.Object);
        }

        [Test]
        public void AddMaterial_ShouldAddMaterial_WithoutMapper()
        {
            // Arrange
            var appUser = new AppUser { Id = "userId", UserName = "testuser" };
            appuserRepoMock.Setup(r => r.FindById("userId")).Returns(appUser);

            var dto = new MaterialCreateUpdateDto
            {
                Title = "Test Title",
                Description = "Test Description",
                Content = new ContentCreateUpdateDto
                {
                    FileName = "file.txt",
                    File = Convert.ToBase64String(Encoding.UTF8.GetBytes("Hello"))
                }
            };

            // Act
            var mat = new Material
            {
                Title = dto.Title,
                Description = dto.Description,
                Content = new FileContent(
                    dto.Content.FileName,
                    Convert.FromBase64String(dto.Content.File)
                ),
                Uploader = appuserRepoMock.Object.FindById("userId")
            };

            materialRepoMock.Object.Add(mat);

            // Assert
            materialRepoMock.Verify(r => r.Add(It.Is<Material>(m =>
                m.Title == dto.Title &&
                m.Description == dto.Description &&
                m.Uploader.Id == "userId" &&
                m.Content.FileName == dto.Content.FileName
            )), Times.Once);
        }
        [Test]
        public void DeleteMaterialById_ShouldCallRepoDelete()
        {
            // Arrange
            var materialId = "material123";

            // Act
            logic.DeleteMaterialById(materialId);

            // Assert
            materialRepoMock.Verify(r => r.DeleteById(materialId), Times.Once);
        }
        [Test]
        public void UpdateMaterial_ShouldUpdateExistingMaterial()
        {

            // Arrange
            var appUser = new AppUser { Id = "user123", UserName = "testuser" };
            appuserRepoMock.Setup(r => r.FindById("user123")).Returns(appUser);
            var existingMaterial = new Material
            {
                Id = "mat123",
                Title = "Old Title",
                Description = "Old Description",
                SubjectId = "placeholder",
                Content = new FileContent("oldfile.txt", Encoding.UTF8.GetBytes("Old content")),
                Uploader = new AppUser { Id = "user123", UserName = "testuser" }
            };

            var dto = new MaterialCreateUpdateDto
            {
                Title = "New Title",
                Description = "New Description",
                SubjectId = "placeholder",
                Content = new ContentCreateUpdateDto
                {
                    FileName = "newfile.txt",
                    File = Convert.ToBase64String(Encoding.UTF8.GetBytes("New content"))
                }
            };

            materialRepoMock.Setup(r => r.FindById("mat123")).Returns(existingMaterial);

            // Act
            logic.UpdateMaterial("mat123", dto);

            // Assert
            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m =>
                m.Id == "mat123" &&
                m.Title == dto.Title &&
                m.Description == dto.Description &&
                m.Uploader.Id == "user123" &&
                m.SubjectId == dto.SubjectId &&
                m.Content != null &&
                m.Content.FileName == dto.Content.FileName &&
                Encoding.UTF8.GetString(m.Content.File) == "New content"
            )), Times.Once);
        }
        [Test]
        public void GetAllMaterials_ShouldReturnAllMaterials()
        {
            // Arrange
            var materials = new List<Material>
            {
                new Material { Id = "1", Title = "Mat1", Uploader = new AppUser { Id = "user1" } },
                new Material { Id = "2", Title = "Mat2", Uploader = new AppUser { Id = "user2" } }
            }.AsQueryable();

            materialRepoMock.Setup(r => r.GetAll()).Returns(materials);

            // Act
            var result = logic.GetAllMaterials().ToList();

            // Assert
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.Any(m => m.Id == "1"));
            Assert.IsTrue(result.Any(m => m.Id == "2"));
        }
        [Test]
        public void GetMaterialById_ShouldReturnCorrectMaterial()
        {
            // Arrange
            var material = new Material
            {
                Id = "mat123",
                Title = "Mat123",
                Uploader = new AppUser
                {
                    Id = "user123",
                    Image = new FileContent("default.png", Encoding.UTF8.GetBytes("dummy"))
                }
            };

            materialRepoMock.Setup(r => r.GetAll())
                .Returns(new List<Material> { material }.AsQueryable());

            // Act
            var result = logic.GetMaterialById("mat123");

            // Assert
            Assert.AreEqual("mat123", result.Id);
            Assert.AreEqual("Mat123", result.Title);
            Assert.AreEqual("user123", result.Uploader.Id);
        }
        [Test]
        public void SetMaterialExamStatus_ShouldUpdateIsExam()
        {
            var material = new Material { Id = "m1", IsExam = false };
            materialRepoMock.Setup(r => r.FindById("m1")).Returns(material);

            logic.SetExamStatus("m1", true);

            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m => m.IsExam == true)), Times.Once);
        }

    }
}
