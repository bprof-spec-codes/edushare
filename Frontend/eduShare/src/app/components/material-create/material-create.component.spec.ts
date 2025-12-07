import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCreateComponent } from './material-create.component';
import { MaterialService } from '../../services/material.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialFormValue } from '../material-form/material-form.component';
import { of, throwError } from 'rxjs';

describe('MaterialCreateComponent', () => {
  let component: MaterialCreateComponent;
  let fixture: ComponentFixture<MaterialCreateComponent>;
  let mockMaterialService: jasmine.SpyObj<MaterialService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockMaterialService = jasmine.createSpyObj('MaterialService', ['create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [MaterialCreateComponent],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCreateComponent);
    component = fixture.componentInstance;
    
    // Default mock return
    mockMaterialService.create.and.returnValue(of(void 0));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCreate', () => {
    it('should show toast and return early when content is undefined', () => {
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: undefined
      };

      component.onCreate(value);

      expect(mockToastService.show).toHaveBeenCalledWith('Kérlek, válassz egy fájlt!');
      expect(mockMaterialService.create).not.toHaveBeenCalled();
    });

    it('should build DTO correctly with all fields', () => {
      const consoleLogSpy = spyOn(console, 'log');
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(mockMaterialService.create).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'test.pdf', file: 'base64content' }
      });
    });

    it('should build DTO correctly without description', () => {
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(mockMaterialService.create).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: undefined,
        content: { fileName: 'test.pdf', file: 'base64content' }
      });
    });

    it('should log message on successful creation', () => {
      const consoleLogSpy = spyOn(console, 'log');
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(consoleLogSpy).toHaveBeenCalledWith('A tananyag sikeresen létre lett hozva.');
    });

    it('should navigate to materials on successful creation', () => {
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials']);
    });

    it('should log error on creation failure', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('Creation failed');
      mockMaterialService.create.and.returnValue(throwError(() => error));
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Nem sikerült létrehozni a tananyagot', error);
    });

    it('should navigate to materials on creation error', () => {
      const error = new Error('Creation failed');
      mockMaterialService.create.and.returnValue(throwError(() => error));
      const value: MaterialFormValue = {
        title: 'Test Title',
        subjectId: 'subject-123',
        content: { fileName: 'test.pdf', file: 'base64content' }
      };

      component.onCreate(value);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials']);
    });
  });
});
