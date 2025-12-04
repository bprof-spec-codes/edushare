import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MaterialService } from './material.service';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { MaterialViewDto } from '../dtos/material-view-dto';
import { MaterialCreateDto } from '../dtos/material-create-dto';
import { SearchDto } from '../dtos/search-dto';
import { environment } from '../../environments/environment';

describe('MaterialService Logic Tests', () => {
  let service: MaterialService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = `${environment.baseApiUrl}/api/material`;

  const mockMaterialShort: MaterialShortViewDto = {
    id: 'mat-1',
    title: 'Test Material',
    isRecommended: false,
    subject: { id: 's1', name: 'Math', semester: 1 },
    uploader: { id: 'u1', fullName: 'User 1', image: { id: 'img1', fileName: 'pic.jpg', file: '' } },
    uploadDate: new Date().toISOString(),
    isExam: false,
    averageRating: 4.5,
    ratingCount: 10,
    downloadCount: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MaterialService]
    });

    service = TestBed.inject(MaterialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('State Management Logic', () => {
    it('should update state after loadAll', (done) => {
      const mockMaterials = [mockMaterialShort];

      service.loadAll().subscribe(() => {
        service.materialsShort$.subscribe(materials => {
          expect(materials).toEqual(mockMaterials);
          done();
        });
      });

      const req = httpMock.expectOne(apiBaseUrl);
      req.flush(mockMaterials);
    });

    it('should update state after delete', (done) => {
      const remainingMaterials: MaterialShortViewDto[] = [];

      service.delete('mat-1').subscribe(() => {
        service.materialsShort$.subscribe(materials => {
          expect(materials).toEqual(remainingMaterials);
          done();
        });
      });

      const deleteReq = httpMock.expectOne(`${apiBaseUrl}/mat-1`);
      deleteReq.flush(null);

      const getAllReq = httpMock.expectOne(apiBaseUrl);
      getAllReq.flush(remainingMaterials);
    });

    it('should update state after search', (done) => {
      const searchDto = new SearchDto('test', null, '', '');
      const searchResults = [mockMaterialShort];

      service.searchMaterials(searchDto).subscribe(() => {
        service.materialsShort$.subscribe(materials => {
          expect(materials).toEqual(searchResults);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/searchMaterials`);
      req.flush(searchResults);
    });
  });

  describe('Recommended Status Update Logic', () => {
    it('should update isRecommended flag for specific material', (done) => {
      const material1 = { ...mockMaterialShort, id: 'mat-1', isRecommended: false };
      const material2 = { ...mockMaterialShort, id: 'mat-2', isRecommended: false };
      
      service['materialShortSubject'].next([material1, material2]);

      service.updateRecommended('mat-1', true).subscribe(() => {
        service.materialsShort$.subscribe(materials => {
          expect(materials[0].isRecommended).toBe(true);
          expect(materials[1].isRecommended).toBe(false);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/mat-1/recommended`);
      req.flush(null);
    });
  });

  describe('Exam Status Update Logic', () => {
    it('should update isExam flag for specific material', (done) => {
      const material1 = { ...mockMaterialShort, id: 'mat-1', isExam: false };
      const material2 = { ...mockMaterialShort, id: 'mat-2', isExam: false };
      
      service['materialShortSubject'].next([material1, material2]);

      service.updateExam('mat-1', true).subscribe(() => {
        service.materialsShort$.subscribe(materials => {
          expect(materials[0].isExam).toBe(true);
          expect(materials[1].isExam).toBe(false);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/mat-1/exam`);
      req.flush(null);
    });
  });
});
