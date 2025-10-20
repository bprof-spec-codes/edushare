using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Helpers
{
    public class ErrorModel
    {
        public string Message { get; set; } = "";

        public ErrorModel(string message)
        {
            Message = message;
        }
    }
}
