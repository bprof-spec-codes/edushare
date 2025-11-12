using Entities.Dtos.Content;
using Entities.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.User
{
    public class AppUserShortViewDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public ContentViewDto Image { get; set; } = null!;
        public int MaterialCount { get; set; } = 0;
        public bool IsWarned { get; set; } = false;
        public bool IsBanned { get; set; } = false;
    }
}
