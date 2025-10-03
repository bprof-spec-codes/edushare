using Data;
using Entities.Dtos.Material;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class MaterialLogic
    {
        Repository<AppUser> appuserRepo;
         Repository<Material> materialRepo;
        DtoProviders dtoProviders;
        
        public MaterialLogic(Repository<Material> repo, DtoProviders dtoProviders, Repository<AppUser> appRepo)
        {
            this.materialRepo = repo;
            this.dtoProviders = dtoProviders;
            this.appuserRepo = appRepo;
        }

        public void AddMaterial(MaterialCreateUpdateDto material , string id)
        {
            Material mat = dtoProviders.Mapper.Map<Material>(material);
            mat.Uploader = appuserRepo.FindById(id);
            if (material.Content != null)
            {
                
                mat.Content = new FileContent(
                    material.Content.FileName,
                    Convert.FromBase64String(material.Content.File)
                );
            }

            materialRepo.Add(mat);

        }
        public IEnumerable<MaterialShortViewDto> GetAllMaterials()
        {
            return materialRepo.GetAll().Select(x => dtoProviders.Mapper.Map<MaterialShortViewDto>(x));
        }
        public void DeleteMaterialById(string id)
        {
            materialRepo.DeleteById(id);
        }
        public void UpdateMaterial(string id, MaterialCreateUpdateDto material)
        {
            var old= materialRepo.FindById(id);
            var mat=dtoProviders.Mapper.Map(material,old);
            materialRepo.Update(mat);
        }
        public MaterialViewDto GetMaterialById(string id)
        {
            var mat= materialRepo.FindById(id);
            return dtoProviders.Mapper.Map<MaterialViewDto>(mat);
        }

    }
}
