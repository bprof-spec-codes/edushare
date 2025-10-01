using Data;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class AppUserLogic
    {
        Repository<AppUser> repo;

        public AppUserLogic(Repository<AppUser> repo)
        {
            this.repo = repo;
        }
    }
}
