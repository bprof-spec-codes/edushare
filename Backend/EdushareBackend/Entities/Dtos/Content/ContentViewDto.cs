using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Content
{
    public class ContentViewDto
    {
        public ContentViewDto(string id, string fileName, string file)
        {
            Id = id;
            FileName = fileName;
            File = file;
        }

        public string Id { get; set; }
        public string FileName { get; set; }
        public string File { get; set; }
    }
}
