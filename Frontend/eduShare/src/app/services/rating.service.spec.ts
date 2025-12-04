import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RatingService } from './rating.service';
import { RatingViewDto } from '../dtos/rating-view-dto';
import { RatingCreateDto } from '../dtos/rating-create-dto';
import { environment } from '../../environments/environment';

describe('RatingService Logic Tests', () => {
  let service: RatingService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = `${environment.baseApiUrl}/api/Rating`;

  const mockRating1: RatingViewDto = {
    id: 'r1',
    userId: 'u1',
    userName: 'User 1',
    rate: 5,
    comment: 'Great!',
    uploadDate: new Date('2025-12-01T10:00:00Z')
  };

  const mockRating2: RatingViewDto = {
    id: 'r2',
    userId: 'u2',
    userName: 'User 2',
    rate: 3,
    comment: 'Good',
    uploadDate: new Date('2025-12-02T10:00:00Z')
  };

  const mockRating3: RatingViewDto = {
    id: 'r3',
    userId: 'u3',
    userName: 'User 3',
    rate: 4,
    comment: 'Nice',
    uploadDate: new Date('2025-11-30T10:00:00Z')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RatingService]
    });

    service = TestBed.inject(RatingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('State Management Logic', () => {
    it('should update ratings state after getRatingsByMaterial', (done) => {
      const mockRatings = [mockRating1, mockRating2];

      service.getRatingsByMaterial('mat-1').subscribe(() => {
        service.ratings$.subscribe(ratings => {
          expect(ratings.length).toBe(2);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/material/mat-1`);
      req.flush(mockRatings);
    });

    it('should update ratings state after deleteRating', (done) => {
      service['_ratings$'].next([mockRating1, mockRating2]);

      service.deleteRating('r1').subscribe(() => {
        service.ratings$.subscribe(ratings => {
          expect(ratings.length).toBe(1);
          expect(ratings[0].id).toBe('r2');
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/r1`);
      req.flush(null);
    });
  });

  describe('Sorting Logic', () => {
    it('should sort ratings by upload date descending (newest first)', (done) => {
      const unsortedRatings = [mockRating3, mockRating1, mockRating2];

      service.getRatingsByMaterial('mat-1').subscribe(() => {
        service.ratings$.subscribe(ratings => {
          expect(ratings[0].id).toBe('r2'); // 2025-12-02 (newest)
          expect(ratings[1].id).toBe('r1'); // 2025-12-01
          expect(ratings[2].id).toBe('r3'); // 2025-11-30 (oldest)
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/material/mat-1`);
      req.flush(unsortedRatings);
    });
  });

  describe('Average Calculation Logic', () => {
    it('should calculate average rating correctly', (done) => {
      const ratings = [mockRating1, mockRating2]; // 5 and 3 = avg 4.0

      service.getRatingsByMaterial('mat-1').subscribe(() => {
        service.ratingAverage$.subscribe(avg => {
          expect(avg).toBe(4.0);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/material/mat-1`);
      req.flush(ratings);
    });

    it('should update average after deleting rating', (done) => {
      const ratings = [mockRating1, mockRating2]; // 5 and 3 = avg 4.0
      service['_ratings$'].next(ratings);
      service['_ratingAverage$'].next(4.0);

      service.deleteRating('r1').subscribe(() => {
        service.ratingAverage$.subscribe(avg => {
          expect(avg).toBe(3.0); // Only rating2 (rate: 3) remains
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/r1`);
      req.flush(null);
    });
  });

  describe('Delete Rating Logic', () => {
    it('should remove specific rating from list', (done) => {
      service['_ratings$'].next([mockRating1, mockRating2, mockRating3]);

      service.deleteRating('r2').subscribe(() => {
        service.ratings$.subscribe(ratings => {
          expect(ratings.length).toBe(2);
          expect(ratings.find(r => r.id === 'r2')).toBeUndefined();
          expect(ratings.find(r => r.id === 'r1')).toBeDefined();
          expect(ratings.find(r => r.id === 'r3')).toBeDefined();
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/r2`);
      req.flush(null);
    });
  });
});
