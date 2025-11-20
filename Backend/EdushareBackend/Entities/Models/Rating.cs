using Entities.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class Rating : IIdEntity
    {
        public Rating()
        {
            Id = Guid.NewGuid().ToString();
        }
        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;
        public virtual AppUser User { get; set; } = null!;
        public string MaterialId { get; set; } = string.Empty;
        public virtual Material Material { get; set; } = null!;
        [Range(0, 5)]
        public int Rate { get; set; }
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;
        public DateTime uploadDate { get; set; }

    }
}
