using AutoMapper;
using Entities.Dtos.Material;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Helper
{
    public class DtoProviders 
    {
        UserManager<AppUser> userManager;
        public Mapper Mapper { get; set; }
        public DtoProviders(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Material, MaterialAppUserShortViewDto>();
                cfg.CreateMap<MaterialCreateUpdateDto, Material>(); 
                cfg.CreateMap<Material, MaterialShortViewDto>();
                cfg.CreateMap<Material, MaterialViewDto>();
            });
            Mapper = new Mapper(config);
        }
    }
}
