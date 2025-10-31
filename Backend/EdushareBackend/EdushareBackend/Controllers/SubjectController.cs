using Entities.Dtos.Content;
using Entities.Dtos.Material;
using Entities.Dtos.Subject;
using Entities.Dtos.User;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController:ControllerBase
    {
        SubjectLogic subjectLogic;

        public SubjectController(SubjectLogic subjectLogic)
        {
            this.subjectLogic = subjectLogic;
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task AddSubject(SubjectCreateDto subject)
        {
            await subjectLogic.AddSubject(subject);
        }

        [HttpGet]
        public IEnumerable<Subject> GetAllSubjects()
        {
            return subjectLogic.GetAllSubjects();
        }

        [HttpDelete]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task DeleteSubject(string id)
        {
            await subjectLogic.DeleteSubject(id);
        }

        [HttpPut]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task UpdateSubject(string id, [FromBody] SubjectCreateDto updatedSubject)
        {
            await subjectLogic.UpdateSubject(id, updatedSubject);
        }
    }
}
