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

  it('should load all favorite materials', (done) => {
    service.getAll().subscribe(materials => {
      expect(materials).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/favouriteMaterials`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMaterial1]);
  });

  it('should add material to favorites', (done) => {
    const initialCount = service['_favMaterials$'].value.length;

    service.setFavouriteMaterial('mat-1', mockMaterial1).subscribe(() => {
      const newCount = service['_favMaterials$'].value.length;
      expect(newCount).toBe(initialCount + 1);
      done();
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/setFavouriteMaterial/mat-1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should remove material from favorites', (done) => {
    service['_favMaterials$'].next([mockMaterial1]);

    service.removeFavouriteMaterial('mat-1').subscribe(() => {
      const remaining = service['_favMaterials$'].value;
      expect(remaining.length).toBe(0);
      done();
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/removeFavouriteMaterial/mat-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should toggle favorite - add when not favorite', (done) => {
    service['_favMaterials$'].next([]);

    service.toggle$(mockMaterial1).subscribe(() => {
      const favs = service['_favMaterials$'].value;
      expect(favs.length).toBe(1);
      expect(favs[0].id).toBe('mat-1');
      done();
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/setFavouriteMaterial/mat-1`);
    req.flush({});
  });

  it('should toggle favorite - remove when already favorite', (done) => {
    service['_favMaterials$'].next([mockMaterial1]);

    service.toggle$(mockMaterial1).subscribe(() => {
      const favs = service['_favMaterials$'].value;
      expect(favs.length).toBe(0);
      done();
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/removeFavouriteMaterial/mat-1`);
    req.flush({});
  });
});
