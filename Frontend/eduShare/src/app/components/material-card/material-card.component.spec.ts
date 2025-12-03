import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCardComponent } from './material-card.component';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { FavMaterialService } from '../../services/fav-material.service';
import { MaterialService } from '../../services/material.service';
import { AuthService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { BehaviorSubject, of, throwError, EMPTY } from 'rxjs';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';

describe('MaterialCardComponent', () => {
  let component: MaterialCardComponent;
  let fixture: ComponentFixture<MaterialCardComponent>;
  let mockRouter: any;
  let mockProfileService: any;
  let mockFavService: any;
  let mockMaterialService: any;
  let mockAuthService: any;
  let mockToastService: any;
  let mockConfirmService: any;
  let favIdsSubject: BehaviorSubject<Set<string>>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.events = EMPTY;
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getProfile']);
    favIdsSubject = new BehaviorSubject(new Set<string>());
    mockFavService = jasmine.createSpyObj('FavMaterialService', ['toggle$']);
    mockFavService.favIds$ = favIdsSubject.asObservable();
    mockMaterialService = jasmine.createSpyObj('MaterialService', ['delete']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockConfirmService = jasmine.createSpyObj('ConfirmService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [MaterialCardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: FavMaterialService, useValue: mockFavService },
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ConfirmService, useValue: mockConfirmService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCardComponent);
    component = fixture.componentInstance;
    component.m = { id: 'mat-123' } as MaterialShortViewDto;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isLoggedIn from authService', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);

      component.ngOnInit();

      expect(component.isLoggedIn).toBe(true);
    });
  });

  describe('ngOnChanges', () => {
    it('should update materialId$ when m changes', (done) => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      component.ngOnInit();

      const newMaterial = { id: 'mat-456' } as MaterialShortViewDto;
      component.m = newMaterial;

      component.ngOnChanges({
        m: new SimpleChange(null, newMaterial, false)
      });

      component['materialId$'].subscribe(id => {
        expect(id).toBe('mat-456');
        done();
      });
    });
  });

  describe('toggleFavourite', () => {
    it('should not toggle when busy', () => {
      component.busy = true;

      component.toggleFavourite();

      expect(mockFavService.toggle$).not.toHaveBeenCalled();
    });

    it('should not toggle when material is null', () => {
      component.m = null as any;

      component.toggleFavourite();

      expect(mockFavService.toggle$).not.toHaveBeenCalled();
    });
  });

  describe('openMaterial', () => {
    it('should navigate to material view page', () => {
      const material = { id: 'mat-789' } as MaterialShortViewDto;

      component.openMaterial(material);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials/mat-789/view']);
    });
  });

  describe('openProfile', () => {
    it('should navigate to profile view page', () => {
      component.openProfile('user-123');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', 'user-123']);
    });
  });

  describe('titleClass', () => {
    it('should return "isExam" when material is exam', () => {
      component.m = { isExam: true } as MaterialShortViewDto;

      const result = component.titleClass();

      expect(result).toBe('isExam');
    });

    it('should return "isNotExam" when material is not exam', () => {
      component.m = { isExam: false } as MaterialShortViewDto;

      const result = component.titleClass();

      expect(result).toBe('isNotExam');
    });
  });

  describe('openSubjectMaterials', () => {
    it('should navigate to materials with subject query param', () => {
      component.openSubjectMaterials('subj-456');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials'], { queryParams: { subject: 'subj-456' } });
    });
  });

  describe('deleteMaterial', () => {
    it('should not delete when material is null', async () => {
      component.material = null;

      await component.deleteMaterial();

      expect(mockConfirmService.confirm).not.toHaveBeenCalled();
    });

    it('should not delete when user cancels confirmation', async () => {
      component.material = { id: 'mat-123' } as MaterialViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.deleteMaterial();

      expect(mockMaterialService.delete).not.toHaveBeenCalled();
    });
  });
});
