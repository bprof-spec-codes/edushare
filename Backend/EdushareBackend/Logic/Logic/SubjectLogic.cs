using Data;
using Entities.Dtos.Subject;
using Entities.Models;

namespace Logic.Logic
{
    public class SubjectLogic
    {
        Repository<Subject> subjectRepo;

        public SubjectLogic(Repository<Subject> subject)
        {
            this.subjectRepo = subject;
        }

        public async Task AddSubject(SubjectCreateDto subject)
        {
            Subject newSubject = new Subject()
            {
                Name = subject.Name,
                Semester = subject.Semester,
                Credit = subject.Credit
            };

            subjectRepo.Add(newSubject);
        }

        public IEnumerable<Subject> GetAllSubjects()
        {
            return subjectRepo.GetAll();

        }

        public async Task DeleteSubject(string id)
        {
            subjectRepo.DeleteById(id);
        }

        public async Task UpdateSubject(string id, SubjectCreateDto updatedSubject)
        {
            var oldSubject = subjectRepo.FindById(id);
            oldSubject.Name = updatedSubject.Name;
            oldSubject.Semester = updatedSubject.Semester;
            oldSubject.Credit = updatedSubject.Credit;
            subjectRepo.Update(oldSubject);
        }
    }
}
