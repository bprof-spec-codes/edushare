using Data;
using Entities.Dtos.Rating;
using Entities.Models;
using Logic.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class RatingLogic
    {
        private readonly Repository<Rating> ratingRepo; 
        private readonly Repository<AppUser> userRepo;
        private readonly Repository<Material> materialRepo;
        private readonly DtoProviders dtoProviders;
        public RatingLogic(Repository<Rating> ratingRepo, Repository<AppUser> userRepo, Repository<Material> materialRepo, DtoProviders dtoProviders)
        {
            this.ratingRepo = ratingRepo;
            this.userRepo = userRepo;
            this.materialRepo = materialRepo;
            this.dtoProviders = dtoProviders;
        }
        public void AddRating(RatingCreateDto dto,string userId)
        {
            var user = userRepo.FindById(userId);
            var material = materialRepo.FindById(dto.MaterialId);
            if (user == null || material == null)
                throw new ArgumentException("Invalid user or material.");

            var rating = dtoProviders.Mapper.Map<Rating>(dto);
            rating.User = user;
            rating.Material = material;
            ratingRepo.Add(rating);
        }
        public IEnumerable<RatingViewDto> GetRatingsByMaterialId(string materialId)
        {
            return ratingRepo.GetAll()
                .Where(r => r.MaterialId == materialId)
                .Select(r => dtoProviders.Mapper.Map<RatingViewDto>(r));
        }
    }
}
