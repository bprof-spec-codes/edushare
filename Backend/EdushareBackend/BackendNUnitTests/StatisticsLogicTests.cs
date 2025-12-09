using AutoMapper;
using Data;
using Entities.Dtos.Material;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendNUnitTests
{
    [TestFixture]
    public class StatisticsLogicTests
    {
        private Mock<Repository<AppUser>> userRepoMock;
        private Mock<Repository<Material>> materialRepoMock;
        private Mock<Repository<Subject>> subjectRepoMock;
        private Mock<Repository<Rating>> ratingRepoMock;
        private Mock<DtoProviders> dtoProviderMock;

        private StatisticsLogic logic;
        private IMapper mapper;

        [SetUp]
        public void Setup()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Material, MaterialShortViewDto>();
                // ide jöhet más DTO-k is, ha kell
            });
            mapper = config.CreateMapper();
            materialRepoMock = new Mock<Repository<Material>>();
            userRepoMock = new Mock<Repository<AppUser>>();
            subjectRepoMock = new Mock<Repository<Subject>>();
            dtoProviderMock = new Mock<DtoProviders>(null!); // ctor paraméter null, mert mockoljuk

            logic = new StatisticsLogic(
                userRepoMock.Object,
                materialRepoMock.Object,
                subjectRepoMock.Object,
                dtoProviderMock.Object,
                new Mock<Repository<Rating>>().Object
            );
        }

        // -------------------------------------------------------------------------------------
        // 1) ADMIN STAT TESZT
        // -------------------------------------------------------------------------------------
        [Test]
        public void GetAdminStatistics_ShouldReturnCorrectPopularMaterials()
        {
            // Arrange
            var materials = new List<Material>
            {
                new Material { Id="1", Title="A", DownloadCount = 5,
                    Uploader = new AppUser{ Id="u1", FirstName="John", LastName="Doe", Image=new FileContent("x", new byte[]{1}) },
                    Ratings = new List<Rating>{ new Rating{ Rate=5 } }
                },
                new Material { Id="2", Title="B", DownloadCount = 10,
                    Uploader = new AppUser{ Id="u2", FirstName="Jane", LastName="Smith", Image=new FileContent("y", new byte[]{1}) },
                    Ratings = new List<Rating>{ new Rating{ Rate=4 }, new Rating{ Rate=2 } }
                }
            }.AsQueryable();

            materialRepoMock.Setup(r => r.GetAll()).Returns(materials);

            userRepoMock.Setup(r => r.GetAll()).Returns(new List<AppUser>().AsQueryable());

            // Act
            var result = logic.GetAdminStatistics();

            // Assert
            Assert.AreEqual("B", result.MostPopularMaterials.First().Title); // highest download first
            Assert.AreEqual(3.0, result.MostPopularMaterials.First().AverageRating); // average (4+2)/2
            Assert.AreEqual(2, result.MostPopularMaterials.First().RatingCount);
        }

        // -------------------------------------------------------------------------------------
        // 2) HOMEPAGE STAT TESZT
        // -------------------------------------------------------------------------------------
        [Test]
        public void GetHomePageStatistics_ShouldReturnCorrectCounts()
        {
            materialRepoMock.Setup(r => r.GetAll()).Returns(new List<Material>
            {
                new Material { Id = "1", Title = "Mat1" },
                new Material { Id = "2", Title = "Mat2" }
            }.AsQueryable());

            userRepoMock.Setup(r => r.GetAll()).Returns(new List<AppUser> { new AppUser() }.AsQueryable());
            subjectRepoMock.Setup(r => r.GetAll()).Returns(new List<Subject> { new Subject() }.AsQueryable());

            var result = logic.GetHomePageStatistics();

            Assert.AreEqual(2, result.MaterialCount);
            Assert.AreEqual(1, result.UserCount);
            Assert.AreEqual(1, result.SubjectCount);
            Assert.AreEqual(2, result.LastMaterials.Count);
            Assert.AreEqual("Mat2", result.LastMaterials[0].Title);
            Assert.AreEqual("Mat1", result.LastMaterials[1].Title);// Mapper most valós értéket ad
        }




        // -------------------------------------------------------------------------------------
        // 3) USER STAT TESZT
        // -------------------------------------------------------------------------------------
        [Test]
        public void GetUserStatistics_ShouldReturnNull_WhenUserNotFound()
        {
            // Arrange
            userRepoMock.Setup(r => r.GetAll())
                .Returns(new List<AppUser>().AsQueryable());

            // Act
            var result = logic.GetUserStatistics("missing");

            // Assert
            Assert.IsNull(result);
        }

        






    }

}

