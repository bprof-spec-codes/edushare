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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('subjects$ Observable', () => {
    it('should expose subjects as an observable', (done) => {
      const mockSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1 },
        { id: '2', name: 'Physics', semester: 2 }
      ];

      service.subjects$.subscribe(subjects => {
        if (subjects.length > 0) {
          expect(subjects).toEqual(mockSubjects);
          done();
        }
      });

      service.getAllSubjects().subscribe();
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      req.flush(mockSubjects);
    });
  });

  describe('getAllSubjects', () => {
    it('should sort subjects alphabetically by name', (done) => {
      const unsortedSubjects: Subject[] = [
        { id: '1', name: 'Physics', semester: 1 },
        { id: '2', name: 'Chemistry', semester: 2 },
        { id: '3', name: 'Biology', semester: 3 }
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
        { id: '1', name: 'Zoology', semester: 3 },
        { id: '2', name: 'Art', semester: 1 },
        { id: '3', name: 'Music', semester: 2 }
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

  describe('updateSubject', () => {
    it('should update the subject in the state when found', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1 },
        { id: '2', name: 'Physics', semester: 2 }
      ];

      const updateDto: SubjectCreateDto = { name: 'Advanced Physics', semester: 3 };

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

    it('should preserve subject ID when updating', (done) => {
      const initialSubjects: Subject[] = [
        { id: 'abc-123', name: 'Original Name', semester: 1 }
      ];

      const updateDto: SubjectCreateDto = { name: 'New Name', semester: 2 };

      service.getAllSubjects().subscribe(() => {
        service.updateSubject(updateDto, 'abc-123').subscribe();
        const updateReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/abc-123`);
        updateReq.flush(null);
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);

      service.subjects$.subscribe(subjects => {
        if (subjects.length === 1 && subjects[0].name === 'New Name') {
          expect(subjects[0].id).toBe('abc-123');
          done();
        }
      });
    });

    it('should not modify state when subject ID not found', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1 }
      ];

      const updateDto: SubjectCreateDto = { name: 'Physics', semester: 2 };

      service.getAllSubjects().subscribe(() => {
        service.updateSubject(updateDto, 'non-existent-id').subscribe();
        const updateReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/non-existent-id`);
        updateReq.flush(null);

        // Wait a bit then verify state unchanged
        setTimeout(() => {
          service.subjects$.subscribe(subjects => {
            expect(subjects.length).toBe(1);
            expect(subjects[0].name).toBe('Mathematics');
            done();
          }).unsubscribe();
        }, 10);
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);
    });

    it('should create immutable copy when updating', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Math', semester: 1 }
      ];

      const updateDto: SubjectCreateDto = { name: 'Updated Math', semester: 2 };

      service.getAllSubjects().subscribe(() => {
        const beforeUpdate = service['_subjects$'].value;
        
        service.updateSubject(updateDto, '1').subscribe();
        const updateReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/1`);
        updateReq.flush(null);

        const afterUpdate = service['_subjects$'].value;
        expect(beforeUpdate).not.toBe(afterUpdate);
        expect(beforeUpdate[0]).not.toBe(afterUpdate[0]);
        done();
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);
    });
  });

  describe('deleteSubject', () => {
    it('should filter out deleted subject from state', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1 },
        { id: '2', name: 'Physics', semester: 2 },
        { id: '3', name: 'Chemistry', semester: 3 }
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

    it('should handle deleting non-existent subject', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', semester: 1 }
      ];

      service.getAllSubjects().subscribe(() => {
        service.deleteSubject('non-existent').subscribe(() => {
          service.subjects$.subscribe(subjects => {
            expect(subjects.length).toBe(1);
            expect(subjects[0].id).toBe('1');
            done();
          }).unsubscribe();
        });
        const deleteReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/non-existent`);
        deleteReq.flush(null);
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);
    });

    it('should create new array instance when deleting', (done) => {
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Math', semester: 1 },
        { id: '2', name: 'Physics', semester: 2 }
      ];

      service.getAllSubjects().subscribe(() => {
        const beforeDelete = service['_subjects$'].value;
        
        service.deleteSubject('2').subscribe();
        const deleteReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject/2`);
        deleteReq.flush(null);

        const afterDelete = service['_subjects$'].value;
        expect(beforeDelete).not.toBe(afterDelete);
        done();
      });

      const initReq = httpMock.expectOne(`${environment.baseApiUrl}/api/Subject`);
      initReq.flush(initialSubjects);
    });
  });
});
