using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Helpers
{
    public class FileContent
    {
        public FileContent(string fileName, byte[] file)
        {
            Id = Guid.NewGuid().ToString();
            FileName = fileName;
            File = file;
        }

        [Key]
        [StringLength(50)]
        public string Id { get; set; }

        [StringLength(50)]
        public string FileName { get; set; }

        public byte[] File { get; set; }
    }
}
