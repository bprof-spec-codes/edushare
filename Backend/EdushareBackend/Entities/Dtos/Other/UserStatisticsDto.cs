namespace Entities.Dtos.Other;

public class UserStatisticsDto
{
    public int MaterialsSaves { get; set; }
    public int MaterialsUploaded { get; set; }
    public int RatingsGiven { get; set; }
    public int MaterialsDownloaded { get; set; }
    public double UserAvgRating { get; set; }
}