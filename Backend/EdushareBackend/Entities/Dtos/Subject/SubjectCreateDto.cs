using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Subject
{
    public class SubjectCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public int Semester { get; set; } = 0;
    }
}
