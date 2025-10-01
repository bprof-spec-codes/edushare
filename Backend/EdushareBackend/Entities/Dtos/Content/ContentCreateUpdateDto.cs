using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Content
{
    public class ContentCreateUpdateDto
    {
        public ContentCreateUpdateDto(string fileName, byte[] file)
        {
            FileName = fileName;
            File = file;
        }

        public required string FileName { get; set; }
        public required byte[] File { get; set; }
    }
}
