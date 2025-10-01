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
        UserManager<AppUser> userManager;

        public AppUserLogic(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        public async Task Register(AppUserRegisterDto dto)
        {
            AppUser user = new AppUser()
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
            };

            userManager.CreateAsync(user, dto.Password);

        }
    }
}
