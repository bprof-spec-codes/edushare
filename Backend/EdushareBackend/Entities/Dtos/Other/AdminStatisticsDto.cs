using Entities.Dtos.Material;
using Entities.Dtos.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Other
{
    public class AdminStatisticsDto
    {
        public List<MaterialShortViewDto>? MostPopularMaterials { get; set; }

        public List<AppUserShortViewDto>? MostActiveUsers { get; set; }
    }
}
