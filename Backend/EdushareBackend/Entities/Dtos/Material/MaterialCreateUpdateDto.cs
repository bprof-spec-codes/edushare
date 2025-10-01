using Entities.Dtos.Content;
using Entities.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Material
{
    public class MaterialCreateUpdateDto
    {

        public required string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public required ContentCreateUpdateDto Content { get; set; } = null!;
    }
}
