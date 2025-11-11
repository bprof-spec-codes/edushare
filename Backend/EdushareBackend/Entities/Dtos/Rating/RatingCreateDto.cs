using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Rating
{
    public  class RatingCreateDto
    {
        public string MaterialId { get; set; } = string.Empty;
        public int Rate { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
