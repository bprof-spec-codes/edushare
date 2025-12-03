import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavMaterialService } from './fav-material.service';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { environment } from '../../environments/environment';

describe('FavMaterialService Logic Tests', () => {
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

  const mockMaterial2: MaterialShortViewDto = {
    id: 'mat-2',
    title: 'Test Material 2',
    isRecommended: true,
    subject: { id: 's2', name: 'Physics', semester: 2 },
    uploader: { id: 'u2', fullName: 'User 2', image: { id: 'img2', fileName: 'pic2.jpg', file: '' } },
    uploadDate: new Date().toISOString(),
    isExam: true,
    averageRating: 3.8,
    ratingCount: 5,
    downloadCount: 3
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

  describe('State Management Logic', () => {
    it('should initialize with empty favorites', (done) => {
      service.favMaterials$.subscribe(favs => {
        expect(favs).toEqual([]);
        done();
      });
    });

    it('should clear favorites', (done) => {
      // First set some favorites
      service['_favMaterials$'].next([mockMaterial1, mockMaterial2]);

      // Then clear
      service.clear();

      service.favMaterials$.subscribe(favs => {
        expect(favs).toEqual([]);
        done();
      });
    });

    it('should update state after adding favorite', (done) => {
      service.setFavouriteMaterial(mockMaterial1.id, mockMaterial1).subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs.length).toBe(1);
          expect(favs[0]).toEqual(mockMaterial1);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/setFavouriteMaterial/${mockMaterial1.id}`);
      req.flush(null);
    });

    it('should append new favorite to existing list', (done) => {
      // Set initial state
      service['_favMaterials$'].next([mockMaterial1]);

      service.setFavouriteMaterial(mockMaterial2.id, mockMaterial2).subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs.length).toBe(2);
          expect(favs).toContain(mockMaterial1);
          expect(favs).toContain(mockMaterial2);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/setFavouriteMaterial/${mockMaterial2.id}`);
      req.flush(null);
    });

    it('should remove favorite from list', (done) => {
      // Set initial state with two materials
      service['_favMaterials$'].next([mockMaterial1, mockMaterial2]);

      service.removeFavouriteMaterial(mockMaterial1.id).subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs.length).toBe(1);
          expect(favs[0]).toEqual(mockMaterial2);
          expect(favs).not.toContain(mockMaterial1);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/removeFavouriteMaterial/${mockMaterial1.id}`);
      req.flush(null);
    });

    it('should update state when getAll is called', (done) => {
      const mockMaterials = [mockMaterial1, mockMaterial2];

      service.getAll().subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs).toEqual(mockMaterials);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/favouriteMaterials`);
      req.flush(mockMaterials);
    });
  });

  describe('Favorite ID Set Logic', () => {
    it('should create set of favorite IDs', (done) => {
      service['_favMaterials$'].next([mockMaterial1, mockMaterial2]);

      service.favIds$.subscribe(idSet => {
        expect(idSet.size).toBe(2);
        expect(idSet.has('mat-1')).toBe(true);
        expect(idSet.has('mat-2')).toBe(true);
        done();
      });
    });

    it('should return empty set when no favorites', (done) => {
      service.favIds$.subscribe(idSet => {
        expect(idSet.size).toBe(0);
        done();
      });
    });

    it('should update ID set when favorites change', (done) => {
      let callCount = 0;

      service.favIds$.subscribe(idSet => {
        callCount++;
        
        if (callCount === 1) {
          expect(idSet.size).toBe(0);
          // Add a favorite
          service['_favMaterials$'].next([mockMaterial1]);
        } else if (callCount === 2) {
          expect(idSet.size).toBe(1);
          expect(idSet.has('mat-1')).toBe(true);
          done();
        }
      });
    });
  });

  describe('isFav$ Logic', () => {
    it('should return true for favorite material', (done) => {
      service['_favMaterials$'].next([mockMaterial1, mockMaterial2]);

      service.isFav$('mat-1').subscribe(isFav => {
        expect(isFav).toBe(true);
        done();
      });
    });

    it('should return false for non-favorite material', (done) => {
      service['_favMaterials$'].next([mockMaterial1]);

      service.isFav$('mat-2').subscribe(isFav => {
        expect(isFav).toBe(false);
        done();
      });
    });

    it('should return false when no favorites exist', (done) => {
      service.isFav$('mat-1').subscribe(isFav => {
        expect(isFav).toBe(false);
        done();
      });
    });
  });

  describe('toggle$ Logic', () => {
    it('should add material when not favorite', (done) => {
      service.toggle$(mockMaterial1).subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs.length).toBe(1);
          expect(favs[0]).toEqual(mockMaterial1);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/setFavouriteMaterial/${mockMaterial1.id}`);
      req.flush(null);
    });

    it('should remove material when already favorite', (done) => {
      service['_favMaterials$'].next([mockMaterial1]);

      service.toggle$(mockMaterial1).subscribe(() => {
        service.favMaterials$.subscribe(favs => {
          expect(favs.length).toBe(0);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/removeFavouriteMaterial/${mockMaterial1.id}`);
      req.flush(null);
    });
  });
});
