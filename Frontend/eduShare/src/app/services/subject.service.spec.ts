import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubjectService } from './subject.service';
import { Subject } from '../models/subject';
import { SubjectCreateDto } from '../dtos/subject-create-dto';
import { environment } from '../../environments/environment';

describe('SubjectService', () => {
  let service: SubjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubjectService]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SubjectService);

    // Handle the constructor call to getAllSubjects
    const req = httpMock.match(`${environment.baseApiUrl}/api/Subject`);
    if (req.length > 0) {
      req[0].flush([]);
    }
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Sorting Logic', () => {
    it('should sort subjects alphabetically by name', (done) => {
      const unsortedSubjects: Subject[] = [
        { id: '1', name: 'Physics', semester: 1, credit: 4 },
        { id: '2', name: 'Chemistry', semester: 2, credit: 3 },
        { id: '3', name: 'Biology', semester: 3, credit: 2 }
      ];

      const expectedOrder = ['Biology', 'Chemistry', 'Physics'];

      service.subjects$.subscribe(subjects => {
        if (subjects.length === 3) {
          const names = subjects.map(s => s.name);
          expect(names).toEqual(expectedOrder);
          done();
        }
      });

      service.getAllSubjects().subscribe();
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      req.flush(unsortedSubjects);
    });

    it('should handle localeCompare sorting correctly', (done) => {
      const subjects: Subject[] = [
        { id: '1', name: 'Zoology', semester: 3, credit: 4 },
        { id: '2', name: 'Art', semester: 1, credit: 3 },
        { id: '3', name: 'Music', semester: 2, credit: 2 }
      ];

      service.subjects$.subscribe(subjects => {
        if (subjects.length === 3) {
          expect(subjects[0].name).toBe('Art');
          expect(subjects[1].name).toBe('Music');
          expect(subjects[2].name).toBe('Zoology');
          done();
        }
      });

      service.getAllSubjects().subscribe();
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      req.flush(subjects);
    });
  });

  describe('State Update Logic', () => {
    it('should update subject in state when found', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1, credit: 4 },
        { id: '2', name: 'Physics', semester: 2, credit: 3 }
      ];

      const updateDto: SubjectCreateDto = { name: 'Advanced Physics', semester: 3, credit: 5 };

      // Set initial state
      service.getAllSubjects().subscribe(() => {
        // Perform update
        service.updateSubject(updateDto, '2').subscribe();
        const updateReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/2`);
        updateReq.flush(null);
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);

      // Verify state update
      service.subjects$.subscribe(subjects => {
        if (subjects.length === 2 && subjects[1].name === 'Advanced Physics') {
          expect(subjects[1].id).toBe('2');
          expect(subjects[1].name).toBe('Advanced Physics');
          done();
        }
      });
    });

    it('should filter out deleted subject from state', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1, credit: 4 },
        { id: '2', name: 'Physics', semester: 2, credit: 3 },
        { id: '3', name: 'Chemistry', semester: 3, credit: 2 }
      ];

      service.getAllSubjects().subscribe(() => {
        service.deleteSubject('2').subscribe();
        const deleteReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/2`);
        deleteReq.flush(null);
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);

      service.subjects$.subscribe(subjects => {
        if (subjects.length === 2) {
          expect(subjects.find(s => s.id === '2')).toBeUndefined();
          expect(subjects.find(s => s.id === '1')).toBeDefined();
          expect(subjects.find(s => s.id === '3')).toBeDefined();
          done();
        }
      });
    });
  });
});
