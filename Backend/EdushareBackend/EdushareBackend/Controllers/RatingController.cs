using Entities.Dtos.Rating;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EdushareBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly RatingLogic ratingLogic;
        public RatingController(RatingLogic ratingLogic)
        {
            this.ratingLogic = ratingLogic;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddRating([FromBody] RatingCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            ratingLogic.AddRating(dto, userId);
            return Ok();


        }
        [HttpGet("material/{materialId}")]
        public IEnumerable<RatingViewDto> GetRatingsByMaterialId(string materialId)
        {
            return ratingLogic.GetRatingsByMaterialId(materialId);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public void DeleteRating(string id)
        {
            ratingLogic.DeleteRatingById(id);
        }


    }
}
