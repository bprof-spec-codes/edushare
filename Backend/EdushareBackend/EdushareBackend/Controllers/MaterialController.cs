using Entities.Dtos.Material;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : ControllerBase
    {
        UserManager<AppUser> UserManager;
        MaterialLogic materialLogic;
        public MaterialController(MaterialLogic materialLogic, UserManager<AppUser> userManager)
        {
            this.materialLogic = materialLogic;
            this.UserManager = userManager;
        }
        [HttpPost]
        // [Authorize]
        public async Task AddMaterial(MaterialCreateUpdateDto dto)
        {
            var user = await UserManager.GetUserAsync(User);

            materialLogic.AddMaterial(dto, user!.Id);

        }

        [HttpDelete("{id}")]
        [Authorize]
        public void DeleteMaterialById(string id)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid != materialLogic.GetMaterialById(id).Uploader.Id)
            {
                throw new UnauthorizedAccessException("You are not allowed to do this");
            }
            materialLogic.DeleteMaterialById(id);
        }

        [HttpPut("{id}")]
        [Authorize]
        public void UpdateMaterial(string id, [FromBody] MaterialCreateUpdateDto dto)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid != materialLogic.GetMaterialById(id).Uploader.Id)
            {
                throw new UnauthorizedAccessException("You are not allowed to do this");
            }
            materialLogic.UpdateMaterial(id, dto);

        }

        [HttpGet]
        public IEnumerable<MaterialShortViewDto> GetAllMaterials()
        {
            return materialLogic.GetAllMaterials();
            //var x = new MaterialShortViewDto();

            //x.Title = "Cim";
            //x.Id = "Id";
            //x.Uploader = new AppUserMaterialShortViewDto{ Id = "123123-1231431-1234134", FullName = "UserName", Image = new ContentViewDto("ImageId", "fileTitle", "fileInBase64") };
            //x.UploadDate = DateTime.Now;

            //return new List<MaterialShortViewDto>()
            //{
            //    x
            //};
        }

        [HttpGet("{id}")]
        public MaterialViewDto GetMaterialById(string id)
        {
            return materialLogic.GetMaterialById(id);
            //return new MaterialViewDto
            //{
            //    Id = id,
            //    Title = "Cim",
            //    Description = "Leiras",
            //    Subject = "Tantargy",
            //    UploadDate = DateTime.Now,
            //    Uploader = new AppUserMaterialShortViewDto { Id = "123123-1231431-1234134", FullName = "UserName", Image = new ContentViewDto("ImageId", "fileTitle", "fileInBase64") },
            //    Content = new ContentViewDto("FileId", "fileTitle", "fileInBase64")
            //};
        }
        [HttpPut("{id}/recommended")]
        [Authorize(Roles = "Teacher,Admin")]
        public void SetMaterialRecommendedStatus(string id, [FromBody] bool isRecommended)
        {
            materialLogic.SetRecommendationStatus(id, isRecommended);
        }
        [HttpPatch("{id}/exam")]
        [Authorize(Roles = "Teacher,Admin")]
        public void SetMaterialExamStatus(string id, [FromBody] bool isExam)
        {
            materialLogic.SetExamStatus(id, isExam);
        }

        [HttpPost("searchMaterials")]
        public async Task<IEnumerable<MaterialShortViewDto>> GetFilteredMaterialsAsync([FromBody] MaterialFilterDto filter)
        {
            var materials = await materialLogic.GetFilteredMaterialsAsync(filter);
            return materials;
        }

        [HttpPost("setFavouriteMaterial/{materialId}")]
        [Authorize]
        public async Task<IActionResult> SetFavouriteMaterial([FromRoute] string materialId)
        {
            AppUser currentUser = await UserManager.GetUserAsync(User);

            await materialLogic.SetFavouriteMaterial(materialId, currentUser);

            return NoContent();
        }

        [HttpGet("favouriteMaterials")]
        [Authorize]
        public async Task<IEnumerable<MaterialShortViewDto>> GetFavouriteMaterials()
        {
            var currentUser = await UserManager.GetUserAsync(User);
            if (currentUser == null)
                return Enumerable.Empty<MaterialShortViewDto>();

            var materials = await materialLogic.GetFavouriteMaterials(currentUser);
            return materials;
        }

        [HttpDelete("removeFavouriteMaterial/{materialId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFavouriteMaterial([FromRoute] string materialId)
        {
            AppUser currentUser = await UserManager.GetUserAsync(User);
            await materialLogic.RemoveFavouriteMaterial(materialId, currentUser);
            return NoContent();
        }

        [HttpPost("MaterialDownloaded")]
        public async Task MaterialDownloaded([FromBody] string materialID)
        {
            await materialLogic.MaterialDownloaded(materialID);
        }






    }
}
