using Entities.Dtos.Content;
using Entities.Dtos.User;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Material
{
    public class MaterialViewDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public AppUserMaterialShortViewDto Uploader { get; set; } = null!;
        public ContentViewDto Content { get; set; } = null!;
    }
}
