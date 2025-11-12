using Entities.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class AppUser : IdentityUser, IIdEntity
    {
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        public FileContent Image { get; set; } = null!;

        [NotMapped]
        public virtual List<Material>? Materials { get; set; }

        public virtual List<Material>? FavouriteMaterials { get; set; }

        public AppUser()
        {
            FavouriteMaterials = new List<Material>();
        }
        public bool IsWarned { get; set; } = false;
        public DateTime? WarnedAt { get; set; }
        public bool IsBanned { get; set; } = false;
        public DateTime? BannedAt { get; set; }
    }
}
