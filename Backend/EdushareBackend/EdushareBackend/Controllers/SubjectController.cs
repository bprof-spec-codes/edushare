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
        public async Task AddSubject(SubjectCreateDto subject)
        {
            subjectLogic.AddSubject(subject);
        }

        [HttpGet]
        public IEnumerable<Subject> GetAllSubjects()
        {
            return subjectLogic.GetAllSubjects();
        }
    }
}
