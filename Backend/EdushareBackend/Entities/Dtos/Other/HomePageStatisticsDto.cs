using Entities.Dtos.Material;

namespace Entities.Dtos.Other;

public class HomePageStatisticsDto
{
    public int MaterialCount { get; set; }
    public int UserCount { get; set; }
    public int SubjectCount { get; set; }
    public List<MaterialShortViewDto> LastMaterials { get; set; }
}