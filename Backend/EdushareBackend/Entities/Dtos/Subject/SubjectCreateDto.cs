namespace Entities.Dtos.Subject
{
    public class SubjectCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public int Semester { get; set; } = 0;
        public int Credit { get; set; } = 0;
    }
}
