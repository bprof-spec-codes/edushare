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
        private Mock<UserManager<AppUser>> userManagerMock;
        private Mock<Repository<Subject>> subjectRepoMock;
        private static Mock<UserManager<AppUser>> MockUserManager()
        {
            var store = new Mock<IUserStore<AppUser>>();
            return new Mock<UserManager<AppUser>>(
                store.Object, // IUserStore<AppUser>
                null, // IOptions<IdentityOptions>
                null, // IPasswordHasher<AppUser>
                null, // IEnumerable<IUserValidator<AppUser>>
                null, // IEnumerable<IPasswordValidator<AppUser>>
                null, // ILookupNormalizer
                null, // IdentityErrorDescriber
                null, // IServiceProvider
                null  // ILogger<UserManager<AppUser>>
            );
        }


        [SetUp]
        public void Setup()
        {
            materialRepoMock = new Mock<Repository<Material>>();
            appuserRepoMock = new Mock<Repository<AppUser>>();
            dtoProviderMock = new Mock<DtoProviders>(null!); // mapper null, nem használjuk
           
            subjectRepoMock = new Mock<Repository<Subject>>();
            var userManagerMock = MockUserManager(); // itt létrehozzuk
            logic = new MaterialLogic(
                materialRepoMock.Object,
                dtoProviderMock.Object,
                appuserRepoMock.Object,
                subjectRepoMock.Object,
                userManagerMock.Object
            );
        }

        [Test]
        public void AddMaterial_ShouldAddMaterialWithoutMapper()
        {
            var appUser = new AppUser { Id = "user1", UserName = "testuser" };
            appuserRepoMock.Setup(r => r.FindById("user1")).Returns(appUser);

            var dto = new MaterialCreateUpdateDto
            {
                Title = "Title",
                Description = "Desc",
                SubjectId = "subj1",
                Content = new ContentCreateUpdateDto
                {
                    FileName = "file.txt",
                    File = Convert.ToBase64String(Encoding.UTF8.GetBytes("Hello"))
                }
            };

            var subject = new Subject { Id = "subj1", Name = "Math" };
            subjectRepoMock.Setup(r => r.FindById("subj1")).Returns(subject);

            // Act
            var material = new Material
            {
                Title = dto.Title,
                Description = dto.Description,
                Content = new FileContent(dto.Content.FileName, Convert.FromBase64String(dto.Content.File)),
                Uploader = appUser,
                Subject = subject
            };

            materialRepoMock.Object.Add(material);

            // Assert
            materialRepoMock.Verify(r => r.Add(It.Is<Material>(m =>
                m.Title == dto.Title &&
                m.Description == dto.Description &&
                m.Uploader.Id == "user1" &&
                m.Content.FileName == dto.Content.FileName &&
                m.Subject.Id == "subj1"
            )), Times.Once);
        }
        



        [Test]
        public void DeleteMaterialById_ShouldCallRepoDelete()
        {
            var id = "mat1";

            logic.DeleteMaterialById(id);

            materialRepoMock.Verify(r => r.DeleteById(id), Times.Once);
        }

        [Test]
        public void UpdateMaterial_ShouldUpdateExistingMaterial()
        {
            var existing = new Material
            {
                Id = "mat1",
                Title = "Old",
                Description = "OldDesc",
                SubjectId = "subj1",
                Content = new FileContent("old.txt", Encoding.UTF8.GetBytes("Old")),
                Uploader = new AppUser { Id = "user1" }
            };

            materialRepoMock.Setup(r => r.FindById("mat1")).Returns(existing);

            var dto = new MaterialCreateUpdateDto
            {
                Title = "New",
                Description = "NewDesc",
                SubjectId = "subj1",
                Content = new ContentCreateUpdateDto
                {
                    FileName = "new.txt",
                    File = Convert.ToBase64String(Encoding.UTF8.GetBytes("New"))
                }
            };

            logic.UpdateMaterial("mat1", dto);

            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m =>
                m.Id == "mat1" &&
                m.Title == "New" &&
                m.Description == "NewDesc" &&
                Encoding.UTF8.GetString(m.Content.File) == "New" &&
                m.Content.FileName == "new.txt"
            )), Times.Once);
        }

        [Test]
        public void SetExamStatus_ShouldUpdateMaterial()
        {
            var mat = new Material { Id = "m1", IsExam = false };
            materialRepoMock.Setup(r => r.FindById("m1")).Returns(mat);

            logic.SetExamStatus("m1", true);

            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m => m.IsExam)), Times.Once);
        }

        [Test]
        public void GetAllMaterials_ShouldReturnAllMaterials()
        {
            var materials = new List<Material>
            {
                new Material { Id = "1", Title = "Mat1", Uploader = new AppUser { Id = "u1" } },
                new Material { Id = "2", Title = "Mat2", Uploader = new AppUser { Id = "u2" } }
            }.AsQueryable();

            materialRepoMock.Setup(r => r.GetAll()).Returns(materials);

            var result = logic.GetAllMaterials().ToList();

            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.Any(m => m.Id == "1"));
            Assert.IsTrue(result.Any(m => m.Id == "2"));
        }

        [Test]
        public void GetMaterialById_ShouldReturnMaterial()
        {
            var mat = new Material
            {
                Id = "mat1",
                Title = "TestMat",
                Uploader = new AppUser { Id = "user1", Image = new FileContent("img.png", Encoding.UTF8.GetBytes("img")) },
                Subject = new Subject { Id = "subj1", Name = "Math" },
                Content = new FileContent("file.txt", Encoding.UTF8.GetBytes("file"))
            };

            materialRepoMock.Setup(r => r.GetAll()).Returns(new List<Material> { mat }.AsQueryable());

            var result = logic.GetMaterialById("mat1");

            Assert.AreEqual("mat1", result.Id);
            Assert.AreEqual("TestMat", result.Title);
            Assert.AreEqual("user1", result.Uploader.Id);
        }
    }
}
