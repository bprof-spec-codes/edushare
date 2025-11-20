namespace Entities.Dtos.Rating
{
    public class RatingViewDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int Rate { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }

    }
}
