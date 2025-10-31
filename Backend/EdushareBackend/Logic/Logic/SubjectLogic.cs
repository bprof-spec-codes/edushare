using Data;
using Entities.Dtos.Subject;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class SubjectLogic
    {
        Repository<Subject> subjectRepo;

        public SubjectLogic(Repository<Subject> subject)
        {
            this.subjectRepo = subject;
        }

        public void AddSubject(SubjectCreateDto subject)
        {
            Subject newSubject = new Subject()
            {
                Name = subject.Name,
                Semester = subject.Semester
            };

            subjectRepo.Add(newSubject);
        }

        public IEnumerable<Subject> GetAllSubjects()
        { 
            return subjectRepo.GetAll();

        }
    }
}
