using Entities.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Material : IIdEntity
    {
        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;

        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [StringLength(50)]
        public string Subject { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; } = DateTime.Now;

        [NotMapped]
        public virtual AppUser? Uploader { get; set; }
        public FileContent Content { get; set; } = null!;

    }
}
