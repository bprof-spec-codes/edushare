using AutoMapper;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.User;
using Entities.Helpers;
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
                cfg.CreateMap<MaterialCreateUpdateDto, Material>()
    .ForMember(dest => dest.Content, opt => opt.Ignore());
                cfg.CreateMap<Material, MaterialShortViewDto>();
                cfg.CreateMap<Material, MaterialViewDto>();
                cfg.CreateMap<ContentCreateUpdateDto, FileContent>();
                cfg.CreateMap<AppUser, AppUserMaterialShortViewDto>();
                cfg.CreateMap<FileContent, ContentViewDto>();
            });
            Mapper = new Mapper(config);
        }
    }
}
