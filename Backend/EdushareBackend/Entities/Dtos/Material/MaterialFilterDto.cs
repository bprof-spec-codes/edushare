using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Material
{
    public class MaterialFilterDto
    {
        public string? Name { get; set; }
        public int? Semester { get; set; }
        
        public string? SubjectId { get; set; }
        public string? UploaderId { get; set; }

    }
}
