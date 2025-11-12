using Entities.Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public class Material : IIdEntity
    {
        public Material()
        {
            Id = Guid.NewGuid().ToString();
        }

        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;

        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [StringLength(50)]
        public string SubjectId { get; set; } = string.Empty;

        public virtual Subject Subject { get; set; }

        //stringId

        [StringLength(1500)]
        public string Description { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; } = DateTime.Now;

        [NotMapped]
        public virtual AppUser? Uploader { get; set; }
        public FileContent Content { get; set; } = null!;

        public bool IsRecommended { get; set; } = false;

        public bool IsExam { get; set; } = false;

        public int DownloadCount { get; set; } = 0;

        public virtual List<AppUser> UsersWhoFavourited { get; set; } = new();


    }
}
