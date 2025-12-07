using Entities.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class Subject : IIdEntity
    {
        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;

        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public int Semester { get; set; } = 0;
        public int Credit { get; set; } = 0;

        public Subject()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
