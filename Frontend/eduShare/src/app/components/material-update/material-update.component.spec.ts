import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialUpdateComponent } from './material-update.component';
import { MaterialService } from '../../services/material.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { MaterialFormValue } from '../material-form/material-form.component';

describe('MaterialUpdateComponent', () => {
  let component: MaterialUpdateComponent;
  let fixture: ComponentFixture<MaterialUpdateComponent>;
  let mockMaterialService: jasmine.SpyObj<MaterialService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockMaterialService = jasmine.createSpyObj('MaterialService', ['getById', 'update']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('mat-123')
        }
      }
    };

    mockMaterialService.getById.and.returnValue(of({} as MaterialViewDto));

    await TestBed.configureTestingModule({
      declarations: [MaterialUpdateComponent],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialUpdateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should extract id from route params', () => {
      component.ngOnInit();

      expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
      expect(component.id).toBe('mat-123');
    });

    it('should navigate to materials on load failure', () => {
      spyOn(console, 'error');
      const error = new Error('Load failed');
      mockMaterialService.getById.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials']);
    });
  });

  describe('onUpdate', () => {
    beforeEach(() => {
      component.id = 'mat-123';
      mockMaterialService.update.and.returnValue(of(void 0));
    });

    it('should return early when material is undefined', () => {
      component.material = undefined;
      const value: MaterialFormValue = {
        title: 'Test',
        subjectId: 'subject-123'
      };

      component.onUpdate(value);

      expect(mockMaterialService.update).not.toHaveBeenCalled();
    });

    it('should use new content when provided', () => {
      component.material = {
        content: { fileName: 'old.pdf', file: 'oldbase64' }
      } as MaterialViewDto;
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'new.pdf', file: 'newbase64' }
      };

      component.onUpdate(value);

      expect(mockMaterialService.update).toHaveBeenCalledWith('mat-123', {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'new.pdf', file: 'newbase64' }
      });
    });

    it('should use existing content when no new content provided', () => {
      component.material = {
        content: { fileName: 'existing.pdf', file: 'existingbase64' }
      } as MaterialViewDto;
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description'
      };

      component.onUpdate(value);

      expect(mockMaterialService.update).toHaveBeenCalledWith('mat-123', {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'existing.pdf', file: 'existingbase64' }
      });
    });

    it('should navigate to view page on successful update', () => {
      component.material = {
        content: { fileName: 'test.pdf', file: 'base64' }
      } as MaterialViewDto;
      const value: MaterialFormValue = {
        title: 'Test',
        subjectId: 'subject-123'
      };

      component.onUpdate(value);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials', 'mat-123', 'view']);
    });

    it('should show toast and navigate on update failure', () => {
      const error = new Error('Update failed');
      mockMaterialService.update.and.returnValue(throwError(() => error));
      spyOn(console, 'error');
      component.material = {
        content: { fileName: 'test.pdf', file: 'base64' }
      } as MaterialViewDto;
      const value: MaterialFormValue = {
        title: 'Test',
        subjectId: 'subject-123'
      };

      component.onUpdate(value);

      expect(mockToastService.show).toHaveBeenCalledWith('Sikertelen módosítás!');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials']);
    });
  });
});
