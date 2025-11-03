using Entities.Dtos.Subject;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
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


        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task UpdateSubject(string id, [FromBody] SubjectCreateDto updatedSubject)
        {
            await subjectLogic.UpdateSubject(id, updatedSubject);
        }
    }
}
