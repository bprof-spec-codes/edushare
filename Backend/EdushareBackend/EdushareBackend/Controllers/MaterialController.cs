using Entities.Dtos;
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
            x.Uploader = new AppUserMaterialShortView{ Id = "123123-1231431-1234134",FullName = "UserName", Image = null };
            x.UploadDate = DateTime.Now;

            return new List<MaterialShortViewDto>()
            {
                x
            };
        }
    }
}
