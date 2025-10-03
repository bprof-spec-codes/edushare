using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

            materialLogic.AddMaterial(dto, "dummyId");

        }

        [HttpDelete("{id}")]
        //[Authorize] Admin / Own Material
        public void DeleteMaterialById(string id)
        {
            materialLogic.DeleteMaterialById(id);
        }

        [HttpPut("{id}")]
        //[Authorize] Admin / Own Material
        public void UpdateMaterial(string id, [FromBody] MaterialCreateUpdateDto dto)
        {

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
            return new MaterialViewDto
            {
                Id = id,
                Title = "Cim",
                Description = "Leiras",
                Subject = "Tantargy",
                UploadDate = DateTime.Now,
                Uploader = new AppUserMaterialShortViewDto { Id = "123123-1231431-1234134", FullName = "UserName", Image = new ContentViewDto("ImageId", "fileTitle", "fileInBase64") },
                Content = new ContentViewDto("FileId", "fileTitle", "fileInBase64")
            };
        }
    }
}
