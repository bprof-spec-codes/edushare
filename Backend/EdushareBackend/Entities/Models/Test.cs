using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Test
    {
        public Test(string text)
        {
            this.Text = text;
        }

        [Key]
        public string Text { get; set; } = "";
    }
}
