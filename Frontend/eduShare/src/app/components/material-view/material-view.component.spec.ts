import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialViewComponent } from './material-view.component';
import { MaterialService } from '../../services/material.service';
import { AuthService } from '../../services/authentication.service';
import { RatingService } from '../../services/rating.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { RatingCreateDto } from '../../dtos/rating-create-dto';

describe('MaterialViewComponent', () => {
  let component: MaterialViewComponent;
  let fixture: ComponentFixture<MaterialViewComponent>;
  let mockMaterialService: jasmine.SpyObj<MaterialService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRatingService: jasmine.SpyObj<RatingService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockConfirmService: jasmine.SpyObj<ConfirmService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let paramMapSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject({ get: (key: string) => 'mat-123' });
    
    mockMaterialService = jasmine.createSpyObj('MaterialService', ['getById', 'updateRecommended', 'updateExam', 'delete', 'materialDownloaded']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId', 'isLoggedIn']);
    mockRatingService = jasmine.createSpyObj('RatingService', ['getRatingsByMaterial', 'createRating', 'deleteRating'], {
      ratings$: of([]),
      ratingAverage$: of(0)
    });
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockConfirmService = jasmine.createSpyObj('ConfirmService', ['confirm']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockMaterialService.getById.and.returnValue(of({} as MaterialViewDto));
    mockRatingService.getRatingsByMaterial.and.returnValue(of([]));
    mockAuthService.getUserId.and.returnValue('user-123');

    await TestBed.configureTestingModule({
      declarations: [MaterialViewComponent],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: RatingService, useValue: mockRatingService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ConfirmService, useValue: mockConfirmService },
        { provide: Router, useValue: mockRouter },
        { 
          provide: ActivatedRoute, 
          useValue: { paramMap: paramMapSubject.asObservable() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should show toast when id is null', () => {
      paramMapSubject.next({ get: () => null });

      component.ngOnInit();

      expect(mockToastService.show).toHaveBeenCalledWith('Érvénytelen azonosító.');
    });
  });

  describe('recommendedMaterial', () => {
    it('should toggle isRecommended from false to true', () => {
      component.material = { id: 'mat-123', isRecommended: false } as MaterialViewDto;
      mockMaterialService.updateRecommended.and.returnValue(of(void 0));

      component.recommendedMaterial('mat-123');

      expect(component.material.isRecommended).toBe(true);
      expect(mockMaterialService.updateRecommended).toHaveBeenCalledWith('mat-123', true);
    });

    it('should toggle isRecommended from true to false', () => {
      component.material = { id: 'mat-123', isRecommended: true } as MaterialViewDto;
      mockMaterialService.updateRecommended.and.returnValue(of(void 0));

      component.recommendedMaterial('mat-123');

      expect(component.material.isRecommended).toBe(false);
      expect(mockMaterialService.updateRecommended).toHaveBeenCalledWith('mat-123', false);
    });
  });

  describe('examMaterial', () => {
    it('should toggle isExam from false to true', () => {
      component.material = { id: 'mat-123', isExam: false } as MaterialViewDto;
      mockMaterialService.updateExam.and.returnValue(of(void 0));

      component.examMaterial('mat-123');

      expect(component.material.isExam).toBe(true);
      expect(mockMaterialService.updateExam).toHaveBeenCalledWith('mat-123', true);
    });

    it('should toggle isExam from true to false', () => {
      component.material = { id: 'mat-123', isExam: true } as MaterialViewDto;
      mockMaterialService.updateExam.and.returnValue(of(void 0));

      component.examMaterial('mat-123');

      expect(component.material.isExam).toBe(false);
      expect(mockMaterialService.updateExam).toHaveBeenCalledWith('mat-123', false);
    });
  });

  describe('downloadFile', () => {
    it('should return early when base64 is undefined', () => {
      component.material = { id: 'mat-123' } as MaterialViewDto;

      component.downloadFile(undefined, 'test.pdf');

      expect(mockMaterialService.materialDownloaded).not.toHaveBeenCalled();
    });

    it('should return early when fileName is undefined', () => {
      component.material = { id: 'mat-123' } as MaterialViewDto;

      component.downloadFile('base64content', undefined);

      expect(mockMaterialService.materialDownloaded).not.toHaveBeenCalled();
    });

    it('should return early when material is null', () => {
      component.material = null;

      component.downloadFile('base64content', 'test.pdf');

      expect(mockMaterialService.materialDownloaded).not.toHaveBeenCalled();
    });
  });

  describe('previewFile', () => {
    it('should return early when material content is undefined', () => {
      component.material = null;

      component.previewFile();

      expect(mockToastService.show).not.toHaveBeenCalled();
    });

    it('should show toast for non-PDF files', () => {
      component.material = {
        content: { fileName: 'test.docx', file: 'base64' }
      } as MaterialViewDto;

      component.previewFile();

      expect(mockToastService.show).toHaveBeenCalledWith('Preview is only available for PDF files.');
    });
  });

  describe('updateMaterial', () => {
    it('should return early when material is null', () => {
      component.material = null;

      component.updateMaterial();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to update page', () => {
      component.material = { id: 'mat-123' } as MaterialViewDto;

      component.updateMaterial();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials', 'mat-123', 'update']);
    });
  });

  describe('toggleDescription', () => {
    it('should toggle showFullDescription from false to true', () => {
      component.showFullDescription = false;

      component.toggleDescription();

      expect(component.showFullDescription).toBe(true);
    });

    it('should toggle showFullDescription from true to false', () => {
      component.showFullDescription = true;

      component.toggleDescription();

      expect(component.showFullDescription).toBe(false);
    });
  });

  describe('openProfile', () => {
    it('should navigate to profile view', () => {
      component.openProfile('user-456');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', 'user-456']);
    });
  });

  describe('deleteMaterial', () => {
    it('should return early when material is null', async () => {
      component.material = null;

      await component.deleteMaterial();

      expect(mockConfirmService.confirm).not.toHaveBeenCalled();
    });

    it('should return early when user cancels', async () => {
      component.material = { id: 'mat-123' } as MaterialViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.deleteMaterial();

      expect(mockMaterialService.delete).not.toHaveBeenCalled();
    });

    it('should navigate to materials on successful deletion', async () => {
      spyOn(console, 'log');
      component.material = { id: 'mat-123' } as MaterialViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(true));
      mockMaterialService.delete.and.returnValue(of(void 0));

      await component.deleteMaterial();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials']);
    });
  });

  describe('openRatingCreateModal', () => {
    it('should navigate to login when user is not logged in', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);

      component.openRatingCreateModal();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.ratingCreateModalOpen).toBe(false);
    });

    it('should open modal when user is logged in', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      component.ratingCreateError = 'previous error';

      component.openRatingCreateModal();

      expect(component.ratingCreateModalOpen).toBe(true);
      expect(component.ratingCreateError).toBeNull();
    });
  });

  describe('closeRatingCreateModal', () => {
    it('should close modal', () => {
      component.ratingCreateModalOpen = true;

      component.closeRatingCreateModal();

      expect(component.ratingCreateModalOpen).toBe(false);
    });
  });

  describe('handleRatingCreate', () => {
    it('should return early when material is null', () => {
      component.material = null;
      const event: RatingCreateDto = { materialId: '', comment: '', rate: 5 };

      component.handleRatingCreate(event);

      expect(mockRatingService.createRating).not.toHaveBeenCalled();
    });
  });

  describe('openCommentModal', () => {
    it('should set comment modal data and open modal', () => {
      component.openCommentModal('John Doe', 'Great material!');

      expect(component.selectedUserName).toBe('John Doe');
      expect(component.selectedComment).toBe('Great material!');
      expect(component.commentModalOpen).toBe(true);
    });
  });

  describe('closeCommentModal', () => {
    it('should close comment modal', () => {
      component.commentModalOpen = true;

      component.closeCommentModal();

      expect(component.commentModalOpen).toBe(false);
    });
  });

  describe('openSubjectMaterials', () => {
    it('should navigate with subject query param', () => {
      component.openSubjectMaterials('subject-456');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials'], { queryParams: { subject: 'subject-456' } });
    });
  });
});
