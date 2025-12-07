import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStatisticsComponent } from './admin-statistics.component';
import { StatisticsService } from '../../services/statistics.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminStatisticsDto } from '../../dtos/admin-statistics-dto';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';

describe('AdminStatisticsComponent', () => {
  let component: AdminStatisticsComponent;
  let fixture: ComponentFixture<AdminStatisticsComponent>;
  let mockStatisticsService: jasmine.SpyObj<StatisticsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStatisticsService = jasmine.createSpyObj('StatisticsService', ['getAdminStatistics']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AdminStatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: mockStatisticsService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with null statistics', () => {
      expect(component.statistics).toBeNull();
    });

    it('should initialize with loading true', () => {
      expect(component.loading).toBe(true);
    });

    it('should initialize with null error', () => {
      expect(component.error).toBeNull();
    });
  });

  describe('loadStatistics', () => {
    it('should set loading to true when called', () => {
      component.loading = false;
      let loadingWasSetToTrue = false;
      
      mockStatisticsService.getAdminStatistics.and.returnValue(of({} as AdminStatisticsDto));

      // Spy on loading property
      const originalLoadingSetter = Object.getOwnPropertyDescriptor(component, 'loading')?.set;
      Object.defineProperty(component, 'loading', {
        get: function() { return this._loading; },
        set: function(value) { 
          if (value === true) loadingWasSetToTrue = true;
          this._loading = value; 
        },
        configurable: true
      });

      component.loadStatistics();

      expect(loadingWasSetToTrue).toBe(true);
    });

    it('should clear error when called', () => {
      mockStatisticsService.getAdminStatistics.and.returnValue(of({} as AdminStatisticsDto));
      component.error = 'Previous error';

      component.loadStatistics();

      expect(component.error).toBeNull();
    });

    it('should set statistics and loading false on success', () => {
      const mockData: AdminStatisticsDto = {
        mostPopularMaterials: [],
        mostActiveUsers: []
      };
      mockStatisticsService.getAdminStatistics.and.returnValue(of(mockData));

      component.loadStatistics();

      expect(component.statistics).toEqual(mockData);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should set error message and loading false on failure', () => {
      const errorResponse = { status: 500, message: 'Server error' };
      mockStatisticsService.getAdminStatistics.and.returnValue(throwError(() => errorResponse));

      component.loadStatistics();

      expect(component.error).toBe('Failed to load statistics. Please try again.');
      expect(component.loading).toBe(false);
      expect(component.statistics).toBeNull();
    });
  });

  describe('viewMaterial', () => {
    it('should navigate to material view with correct route', () => {
      const materialId = 'mat-123';

      component.viewMaterial(materialId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials', materialId, 'view']);
    });

    it('should handle different material IDs', () => {
      const materialId = 'different-id-456';

      component.viewMaterial(materialId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials', materialId, 'view']);
    });
  });

  describe('getMaterialImageSrc', () => {
    it('should return default image when uploader is null', () => {
      const material = { uploader: null } as unknown as MaterialShortViewDto;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe('assets/default-material.png');
    });

    it('should return default image when uploader image is null', () => {
      const material = { 
        uploader: { image: null } 
      } as unknown as MaterialShortViewDto;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe('assets/default-material.png');
    });

    it('should return default image when image file is null', () => {
      const material = { 
        uploader: { 
          image: { file: null } 
        } 
      } as any;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe('assets/default-material.png');
    });

    it('should return http URL as-is when file starts with http', () => {
      const httpUrl = 'http://example.com/image.png';
      const material = { 
        uploader: { 
          image: { file: httpUrl } 
        } 
      } as any;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe(httpUrl);
    });

    it('should return https URL as-is when file starts with http', () => {
      const httpsUrl = 'https://example.com/image.png';
      const material = { 
        uploader: { 
          image: { file: httpsUrl } 
        } 
      } as any;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe(httpsUrl);
    });

    it('should format base64 data when file does not start with http', () => {
      const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const material = { 
        uploader: { 
          image: { file: base64Data } 
        } 
      } as any;

      const result = component.getMaterialImageSrc(material);

      expect(result).toBe(`data:image/*;base64,${base64Data}`);
    });
  });

  describe('viewProfile', () => {
    it('should navigate to profile view with correct user ID', () => {
      const userId = 'user-123';

      component.viewProfile(userId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', userId]);
    });

    it('should handle different user IDs', () => {
      const userId = 'another-user-789';

      component.viewProfile(userId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', userId]);
    });
  });

  describe('getProfileImageSrc', () => {
    it('should return default image when image is null', () => {
      const user = { image: null } as unknown as ProfilListViewDto;

      const result = component.getProfileImageSrc(user);

      expect(result).toBe('assets/default-avatar.png');
    });

    it('should return default image when image file is null', () => {
      const user = { 
        image: { file: null } 
      } as any;

      const result = component.getProfileImageSrc(user);

      expect(result).toBe('assets/default-avatar.png');
    });

    it('should return http URL as-is when file starts with http', () => {
      const httpUrl = 'http://example.com/avatar.png';
      const user = { 
        image: { file: httpUrl } 
      } as any;

      const result = component.getProfileImageSrc(user);

      expect(result).toBe(httpUrl);
    });

    it('should return https URL as-is when file starts with http', () => {
      const httpsUrl = 'https://example.com/avatar.png';
      const user = { 
        image: { file: httpsUrl } 
      } as any;

      const result = component.getProfileImageSrc(user);

      expect(result).toBe(httpsUrl);
    });

    it('should format base64 data when file does not start with http', () => {
      const base64Data = 'base64encodedimagedata';
      const user = { 
        image: { file: base64Data } 
      } as any;

      const result = component.getProfileImageSrc(user);

      expect(result).toBe(`data:image/*;base64,${base64Data}`);
    });
  });
});
