namespace Entities.Dtos.Other;

public class UserStatisticsDto
{
    public int MaterialsSaved { get; set; }
    public int MaterialsUploaded { get; set; }
    public int RatingsGiven { get; set; }
    public double UserAvgRating { get; set; }
}