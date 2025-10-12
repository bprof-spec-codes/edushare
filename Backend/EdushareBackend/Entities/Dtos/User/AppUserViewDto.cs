using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.User
{
    public class AppUserViewDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public ContentViewDto Image { get; set; } = null!;
        public List<MaterialViewDto> Materials { get; set; } = new List<MaterialViewDto>();
    }
}
