using AutoMapper;
using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.Rating;
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
                    .ForMember(dest => dest.Content, opt => opt.Ignore())
                    .ForMember(dest => dest.Subject, opt => opt.Ignore());
                cfg.CreateMap<Material, MaterialShortViewDto>()
                    .ForMember(dest => dest.Uploader, opt => opt.MapFrom(src => new AppUserMaterialShortViewDto
                    {
                        Id = src.Uploader!.Id,
                        FullName = src.Uploader.FirstName + " " + src.Uploader.LastName,
                        Image = new ContentViewDto(
                            src.Uploader.Image.Id,
                            src.Uploader.Image.FileName,
                            Convert.ToBase64String(src.Uploader.Image.File)
                        )
                    }));
                cfg.CreateMap<Material, MaterialViewDto>()
                     .ForMember(dest => dest.Uploader, opt => opt.MapFrom(src => src.Uploader != null
                         ? new AppUserMaterialShortViewDto
                         {
                             Id = src.Uploader.Id,
                             FullName = src.Uploader.FirstName + " " + src.Uploader.LastName,
                             Image = new ContentViewDto(


                                     src.Uploader.Image.Id,
                                    src.Uploader.Image.FileName,
                                     Convert.ToBase64String(src.Uploader.Image.File)
                                 )
                         }
                         : null))
                     .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content != null
                         ? new ContentViewDto(


                             src.Content.Id,
                             src.Content.FileName,
                             Convert.ToBase64String(src.Content.File)
                         )
                         : null));

                cfg.CreateMap<ContentCreateUpdateDto, FileContent>();
                cfg.CreateMap<AppUser, AppUserMaterialShortViewDto>();
                cfg.CreateMap<FileContent, ContentViewDto>();
                cfg.CreateMap<Rating, RatingViewDto>()
                     .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

                cfg.CreateMap<RatingCreateDto, Rating>();

            });
            Mapper = new Mapper(config);
        }
    }
}
