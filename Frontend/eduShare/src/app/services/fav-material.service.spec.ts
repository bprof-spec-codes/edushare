import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavMaterialService } from './fav-material.service';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { environment } from '../../environments/environment';

describe('FavMaterialService', () => {
  let service: FavMaterialService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = `${environment.baseApiUrl}/api/material`;

  const mockMaterial1: MaterialShortViewDto = {
    id: 'mat-1',
    title: 'Test Material 1',
    isRecommended: false,
    subject: { id: 's1', name: 'Math', semester: 1 },
    uploader: { id: 'u1', fullName: 'User 1', image: { id: 'img1', fileName: 'pic1.jpg', file: '' } },
    uploadDate: new Date().toISOString(),
    isExam: false,
    averageRating: 4.5,
    ratingCount: 10,
    downloadCount: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavMaterialService]
    });

    service = TestBed.inject(FavMaterialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear favorites', (done) => {
    service['_favMaterials$'].next([mockMaterial1]);

    service.clear();

    service.favMaterials$.subscribe(favs => {
      expect(favs).toEqual([]);
      done();
    });
  });

  it('should create set of favorite IDs', (done) => {
    const mockMaterial2 = { ...mockMaterial1, id: 'mat-2' };
    service['_favMaterials$'].next([mockMaterial1, mockMaterial2]);

    service.favIds$.subscribe(idSet => {
      expect(idSet.size).toBe(2);
      expect(idSet.has('mat-1')).toBe(true);
      expect(idSet.has('mat-2')).toBe(true);
      done();
    });
  });

  it('should return true for favorite material', (done) => {
    service['_favMaterials$'].next([mockMaterial1]);

    service.isFav$('mat-1').subscribe(isFav => {
      expect(isFav).toBe(true);
      done();
    });
  });

  it('should return false for non-favorite material', (done) => {
    service.isFav$('mat-999').subscribe(isFav => {
      expect(isFav).toBe(false);
      done();
    });
  });
});
