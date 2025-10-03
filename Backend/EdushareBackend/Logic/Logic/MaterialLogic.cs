using Data;
using Entities.Dtos.Material;
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
         Repository<Material> repo;
        DtoProviders dtoProviders;
        
        public MaterialLogic(Repository<Material> repo, DtoProviders dtoProviders)
        {
            this.repo = repo;
            this.dtoProviders = dtoProviders;
        }

        public void AddMaterial(MaterialCreateUpdateDto material)
        {
            Material mat=dtoProviders.Mapper.Map<Material>(material);
            repo.Add(mat);
            
        }
        public IEnumerable<MaterialShortViewDto> GetAllMaterials()
        {
            return repo.GetAll().Select(x => dtoProviders.Mapper.Map<MaterialShortViewDto>(x));
        }
        public void DeleteMaterialById(string id)
        {
            repo.DeleteById(id);
        }
        public void UpdateMaterial(string id, MaterialCreateUpdateDto material)
        {
            var old= repo.FindById(id);
            var mat=dtoProviders.Mapper.Map(material,old);
            repo.Update(mat);
        }
        public MaterialViewDto GetMaterialById(string id)
        {
            var mat= repo.FindById(id);
            return dtoProviders.Mapper.Map<MaterialViewDto>(mat);
        }

    }
}
