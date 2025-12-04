using Data;
using Entities.Dtos.Other;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.Dtos.Material;
using Logic.Helper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic
{
    public class StatisticsLogic
    {
        Repository<AppUser> userRepository;
        Repository<Material> materialRepository;
        Repository<Subject> subjectRepository;
        Repository<Rating> ratingRepository;
        DtoProviders dtoProviders;

        public StatisticsLogic(Repository<AppUser> userRepository, Repository<Material> materialRepository, Repository<Subject> subjectRepository, DtoProviders dtoProviders, Repository<Rating> ratingRepository)
        {
            this.userRepository = userRepository;
            this.materialRepository = materialRepository;
            this.subjectRepository = subjectRepository;
            this.dtoProviders = dtoProviders;
            this.ratingRepository = ratingRepository;
        }

        public AdminStatisticsDto GetAdminStatistics()
        { 
            var mostDownloadedMaterials = materialRepository.GetAll()
                .OrderByDescending(m => m.DownloadCount)
                .Take(10)
                .Select(m => new Entities.Dtos.Material.MaterialShortViewDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    IsRecommended = m.IsRecommended,
                    IsExam = m.IsExam,
                    Subject = m.Subject,
                    Uploader = new Entities.Dtos.User.AppUserMaterialShortViewDto
                    {
                        Id = m.Uploader.Id,
                        FullName = m.Uploader.FirstName + " " + m.Uploader.LastName,
                        Image = new Entities.Dtos.Content.ContentViewDto
                        {
                            Id = m.Uploader.Image.Id,
                            FileName = m.Uploader.Image.FileName,
                            File = Convert.ToBase64String(m.Uploader.Image.File)
                        },
                    },
                    UploadDate = m.UploadDate,
                    DownloadCount = m.DownloadCount,
                    AverageRating = m.Ratings.Count > 0 ? m.Ratings.Average(r => r.Rate) : 0.0,
                    RatingCount = m.Ratings.Count
                })
                .ToList();

            var usersWithMostMaterials = userRepository.GetAll()
                .OrderByDescending(u => u.Materials.Count)
                .Take(10)
                .Select(u => new Entities.Dtos.User.AppUserShortViewDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FirstName + " " + u.LastName,
                    Image = new Entities.Dtos.Content.ContentViewDto
                    {
                        Id = u.Image.Id,
                        FileName = u.Image.FileName,
                        File = Convert.ToBase64String(u.Image.File)
                    },
                    MaterialCount = u.Materials.Count
                })
                .ToList();

            return new AdminStatisticsDto
            {
                MostPopularMaterials = mostDownloadedMaterials,
                MostActiveUsers = usersWithMostMaterials
            };

        }

        public HomePageStatisticsDto GetHomePageStatistics()
        {
            int materialCount = materialRepository.GetAll().Count();
            int userCount = userRepository.GetAll().Count();
            int subjectCount = subjectRepository.GetAll().Count();

            var lastMaterials = materialRepository.GetAll()
                .Include(u => u.Subject)
                .Include(u => u.Uploader)
                .ThenInclude(u => u.Image)
                .Include(u => u.Ratings)
                .OrderByDescending(m => m.UploadDate)
                .Take(3)
                .Select(x => dtoProviders.Mapper.Map<MaterialShortViewDto>(x))
                .ToList();
            

            return new HomePageStatisticsDto
            {
                MaterialCount = materialCount,
                UserCount = userCount,
                SubjectCount = subjectCount,
                LastMaterials = lastMaterials
            };
        }

        public UserStatisticsDto GetUserStatistics(string userId)
        {
            var user = userRepository.GetAll()
                .Include(u => u.FavouriteMaterials)
                .FirstOrDefault(u => u.Id == userId);
            
            if (user == null)
            {
                return null;
            }
            
            int materialsSaved = user.FavouriteMaterials.Count();

            var materialsUploaded = materialRepository.GetAll()
                .Where(m => m.Uploader.Id == userId)!
                .Count();
            
            int ratingsGiven = ratingRepository.GetAll()
                .Select(r => r.UserId == userId)
                .Count();

            var userMaterials = materialRepository.GetAll()
                .Include(m => m.Ratings)
                .Where(m => m.Uploader.Id == userId);

            var allRatings = userMaterials
                .SelectMany(m => m.Ratings)
                .Select(r => r.Rate);

            double userAvgRating = allRatings.Any() ? Math.Round(allRatings.Average(), 1) : 0.0;

            return new UserStatisticsDto
            {
                MaterialsSaved = materialsSaved,
                MaterialsUploaded = materialsUploaded,
                RatingsGiven = ratingsGiven,
                UserAvgRating = userAvgRating,
            };
        }
    }
}
