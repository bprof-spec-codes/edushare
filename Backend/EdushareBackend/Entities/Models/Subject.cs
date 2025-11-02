using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Subject:IIdEntity
    {
        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;

        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public int Semester { get; set; } = 0;

        public Subject()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
