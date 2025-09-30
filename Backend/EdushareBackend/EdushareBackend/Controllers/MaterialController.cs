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

        public 
    }
}
