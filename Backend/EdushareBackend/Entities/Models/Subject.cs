using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Subject:IIdEntity
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public int Semester { get; set; } = 0;

        public Subject()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
