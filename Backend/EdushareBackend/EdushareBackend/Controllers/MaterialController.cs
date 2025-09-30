using Entities.Dtos.Material;
using Entities.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : ControllerBase
    {
        [HttpPost]
        //[Authorize]
        public void AddMaterial(MaterialCreateUpdateDto dto)
        {

        }

        [HttpDelete("{id}")]
        //[Authorize]
        public void DeleteMaterialById(string id)
        {

        }

        [HttpPut]
        //[Authorize]
        public void UpdateMaterial(MaterialCreateUpdateDto dto)
        {

        }

        [HttpGet]
        public IEnumerable<MaterialShortViewDto> GetAllMaterials()
        {
            var x = new MaterialShortViewDto();

            x.Title = "Cim";
            x.Id = "Id";
            x.Uploader = new AppUserMaterialShortViewDto{ Id = "123123-1231431-1234134",FullName = "UserName", Image = null };
            x.UploadDate = DateTime.Now;

            return new List<MaterialShortViewDto>()
            {
                x
            };
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
                Uploader = new AppUserMaterialShortViewDto { Id = "123123-1231431-1234134", FullName = "UserName", Image = null },
                File = null
            };
        }
    }
}
