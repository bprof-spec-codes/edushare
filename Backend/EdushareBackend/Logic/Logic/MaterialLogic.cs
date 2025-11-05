using Data;
using Entities.Dtos.Material;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;
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
        Repository<Subject> subjectRepo;

        public MaterialLogic(Repository<Material> repo, DtoProviders dtoProviders, Repository<AppUser> appRepo, Repository<Subject> subjectRepo)
        {
            this.materialRepo = repo;
            this.dtoProviders = dtoProviders;
            this.appuserRepo = appRepo;
            this.subjectRepo = subjectRepo;
        }

        public void AddMaterial(MaterialCreateUpdateDto material, string id)
        {
            Material mat = dtoProviders.Mapper.Map<Material>(material);
            mat.Uploader = appuserRepo.FindById(id);

            Subject subject = subjectRepo.FindById(material.SubjectId);

            if (subject == null)
            {
                throw new Exception("Subject not found");
            }

            mat.Subject = subject;

            

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
            return materialRepo.GetAll().Include(u => u.Subject).Include(u => u.Uploader).ThenInclude(u => u.Image).Select(x => dtoProviders.Mapper.Map<MaterialShortViewDto>(x));

        }
        public void DeleteMaterialById(string id)
        {
            materialRepo.DeleteById(id);
        }
        public void UpdateMaterial(string id, MaterialCreateUpdateDto dto)
        {
            var old = materialRepo.FindById(id);
            if (old == null) throw new Exception("Material not found");

            old.Title = dto.Title;
            old.Description = dto.Description;

            var newSubject = subjectRepo.FindById(dto.SubjectId);
            old.Subject = newSubject;


            if (dto.Content != null)
            {
                if (old.Content == null)
                {
                    old.Content = new FileContent(
                        dto.Content.FileName,
                        Convert.FromBase64String(dto.Content.File)                   
                    );
                }
                else
                {
                    old.Content.FileName = dto.Content.FileName;
                    old.Content.File = Convert.FromBase64String(dto.Content.File);
                    
                }
            }

            materialRepo.Update(old);
        }
        //RGVtbzI=
        public MaterialViewDto GetMaterialById(string id)
        {
            var mat = materialRepo.GetAll()
                .Include(m => m.Subject)
             .Include(m => m.Content)
             .Include(m => m.Uploader)
                 .ThenInclude(u => u.Image)
             .FirstOrDefault(m => m.Id == id);

            if (mat == null)
                throw new Exception("Material not found");

            return dtoProviders.Mapper.Map<MaterialViewDto>(mat);
        }
        public void SetRecommendationStatus(string id, bool isRecommended)
        {
            var material = materialRepo.FindById(id);
            if (material == null)
                throw new Exception("Material not found");
            material.IsRecommended = isRecommended;
            materialRepo.Update(material);
        }


        public async Task<IEnumerable<MaterialShortViewDto>> GetFilteredMaterialsAsync(
            string? name,
            int? semester,
            string? fileType,
            DateTime? uploadDate)
        {
            var query = materialRepo.GetAll()
                .Include(m => m.Subject)
                .Include(m => m.Content)
                .Include(m => m.Uploader)
                    .ThenInclude(u => u.Image)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(m => m.Title.Contains(name));

            if (semester.HasValue)
                query = query.Where(m => m.Subject.Semester == semester.Value);

            if (!string.IsNullOrWhiteSpace(fileType))
                query = query.Where(m => m.Content.FileName.Contains(fileType));

            if (uploadDate.HasValue)
            {
                var date = uploadDate.Value.Date;
                query = query.Where(m => m.UploadDate.Date == date);
            }

                var materials = await query.ToListAsync();

            return materials.Select(m => dtoProviders.Mapper.Map<MaterialShortViewDto>(m));
        }





    }
}
