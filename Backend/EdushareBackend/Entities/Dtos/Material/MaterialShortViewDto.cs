using Entities.Dtos.User;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Material
{
    public class MaterialShortViewDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public bool IsRecommended { get; set; } = false;
        public bool IsExam { get; set; } = false;
        public double AverageRating { get; set; } = 0.0;
        public int RatingCount { get; set; } = 0;
        public Entities.Models.Subject Subject { get; set; }
        public AppUserMaterialShortViewDto Uploader { get; set; } = null!;
        public DateTime UploadDate { get; set; }
        public int DownloadCount { get; set; } = 0;
    }
}
