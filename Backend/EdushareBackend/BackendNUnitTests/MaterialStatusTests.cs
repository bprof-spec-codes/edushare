using Data;
using Entities.Models;
using Logic.Logic;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendNUnitTests
{
    public class MaterialStatusTests
    {
        private Mock<Repository<Material>> materialRepoMock;
        private MaterialLogic logic;

        [SetUp]
        public void Setup()
        {
            materialRepoMock = new Mock<Repository<Material>>();

            // Dummy MaterialLogic, csak ami kell a metódushoz
            logic = new MaterialLogic(
                materialRepoMock.Object,
                null!,    // dtoProviders nem kell
                null!,    // appUserRepo nem kell
                null!,    // subjectRepo nem kell
                null!     // UserManager nem kell
            );
        }

        [Test]
        public void SetRecommendationStatus_ShouldUpdateIsRecommended()
        {
            // Arrange
            var material = new Material { Id = "m1", IsRecommended = false };
            materialRepoMock.Setup(r => r.FindById("m1")).Returns(material);

            // Act
            logic.SetRecommendationStatus("m1", true);

            // Assert
            Assert.IsTrue(material.IsRecommended);
            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m => m.Id == "m1" && m.IsRecommended)), Times.Once);
        }

        [Test]
        public void SetExamStatus_ShouldUpdateIsExam()
        {
            // Arrange
            var material = new Material { Id = "m2", IsExam = false };
            materialRepoMock.Setup(r => r.FindById("m2")).Returns(material);

            // Act
            logic.SetExamStatus("m2", true);

            // Assert
            Assert.IsTrue(material.IsExam);
            materialRepoMock.Verify(r => r.Update(It.Is<Material>(m => m.Id == "m2" && m.IsExam)), Times.Once);
        }

    }
}
