using Data;
using Entities.Dtos.Other;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class StatisticsLogic
    {
        Repository<AppUser> userRepository;
        Repository<Material> materialRepository;

        public StatisticsLogic(Repository<AppUser> userRepository, Repository<Material> materialRepository)
        {
            this.userRepository = userRepository;
            this.materialRepository = materialRepository;
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
                    DownloadCount = m.DownloadCount
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
    }
}
