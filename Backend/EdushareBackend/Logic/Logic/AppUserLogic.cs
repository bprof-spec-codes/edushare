using Data;
using Entities.Dtos.User;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
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
        UserManager<AppUser> userManager;

        public AppUserLogic(Repository<AppUser> repo, UserManager<AppUser> userManager)
        {
            this.repo = repo;
            this.userManager = userManager;
        }

        public void Register(AppUserRegisterDto dto)
        {
            AppUser user = new AppUser()
            {
                Id = Guid.NewGuid().ToString(),
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                
            };

            

        }
    }
}
