import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialFormComponent } from './material-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { SubjectService } from '../../services/subject.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Subject } from '../../models/subject';

describe('MaterialFormComponent', () => {
  let component: MaterialFormComponent;
  let fixture: ComponentFixture<MaterialFormComponent>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockSubjectService: jasmine.SpyObj<SubjectService>;

  beforeEach(async () => {
    mockFileService = jasmine.createSpyObj('FileService', ['toFileContent']);
    mockSubjectService = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    
    mockSubjectService.getAllSubjects.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [MaterialFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: FileService, useValue: mockFileService },
        { provide: SubjectService, useValue: mockSubjectService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with empty values when no initial values provided', () => {
      component.ngOnInit();

      expect(component.materialForm.value).toEqual({
        title: '',
        subject: '',
        description: '',
        file: null
      });
    });

    it('should initialize form with initial values when provided', () => {
      component.initial = {
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description'
      };

      component.ngOnInit();

      expect(component.materialForm.value.title).toBe('Test Title');
      expect(component.materialForm.value.subject).toBe('subject-123');
      expect(component.materialForm.value.description).toBe('Test Description');
    });

    it('should set disableDefault to true when subject is pre-selected', () => {
      component.initial = { subjectId: 'subject-123' };

      component.ngOnInit();

      expect(component.disableDefault).toBe(true);
    });

    it('should set disableDefault to false when subject is not pre-selected', () => {
      component.initial = {};

      component.ngOnInit();

      expect(component.disableDefault).toBe(false);
    });

    it('should require file in create mode', () => {
      component.isUpdateMode = false;

      component.ngOnInit();

      const fileControl = component.materialForm.get('file');
      expect(fileControl?.hasError('required')).toBe(true);
    });

    it('should not require file in update mode', () => {
      component.isUpdateMode = true;

      component.ngOnInit();

      const fileControl = component.materialForm.get('file');
      expect(fileControl?.hasError('required')).toBe(false);
    });
  });

  describe('description getter', () => {
    it('should return description form control', () => {
      component.ngOnInit();

      const descriptionControl = component.description;

      expect(descriptionControl).toBe(component.materialForm.get('description'));
    });
  });

  describe('onFileSelected', () => {
    it('should clear fileError and return early when no file selected', async () => {
      component.fileError = 'Previous error';
      const event = { target: { files: [] } } as unknown as Event;

      await component.onFileSelected(event);

      expect(component.fileError).toBe('');
      expect(mockFileService.toFileContent).not.toHaveBeenCalled();
    });

    it('should set fileError for unsupported file type', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const event = { target: { files: [file] } } as unknown as Event;
      component.ngOnInit();

      await component.onFileSelected(event);

      expect(component.fileError).toBe('Nem támogatott fájltípus. Kérlek, válassz egy érvényes fájlt. (pdf, doc, docx, ppt, pptx)');
      expect(component.materialForm.get('file')?.value).toBe('');
    });

    it('should handle file extension case-insensitively', async () => {
      const file = new File(['content'], 'test.PDF', { type: 'application/pdf' });
      const event = { target: { files: [file] } } as unknown as Event;
      const fileContent = { fileName: 'test.PDF', file: 'base64content' };
      mockFileService.toFileContent.and.returnValue(Promise.resolve(fileContent));
      component.ngOnInit();

      await component.onFileSelected(event);

      expect(component.fileError).toBe('');
      expect(component.content).toEqual(fileContent);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should mark form as touched and return when form is invalid', () => {
      component.materialForm.patchValue({ title: '', subject: '' });
      const markAllAsTouchedSpy = spyOn(component.materialForm, 'markAllAsTouched');
      spyOn(component.submitted, 'emit');

      component.submit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.submitted.emit).not.toHaveBeenCalled();
    });

    it('should emit value without description when description is empty', () => {
      spyOn(component.submitted, 'emit');
      component.materialForm.patchValue({
        title: 'Test Title',
        subject: 'subject-123',
        description: '',
        file: 'test.pdf'
      });
      component.content = { fileName: 'test.pdf', file: 'base64' };

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: undefined,
        content: { fileName: 'test.pdf', file: 'base64' }
      });
    });

    it('should emit value without description when description is whitespace only', () => {
      spyOn(component.submitted, 'emit');
      component.materialForm.patchValue({
        title: 'Test Title',
        subject: 'subject-123',
        description: '   ',
        file: 'test.pdf'
      });
      component.content = { fileName: 'test.pdf', file: 'base64' };

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: undefined,
        content: { fileName: 'test.pdf', file: 'base64' }
      });
    });

    it('should trim description and emit', () => {
      spyOn(component.submitted, 'emit');
      component.materialForm.patchValue({
        title: 'Test Title',
        subject: 'subject-123',
        description: '  Test Description  ',
        file: 'test.pdf'
      });
      component.content = { fileName: 'test.pdf', file: 'base64' };

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description',
        content: { fileName: 'test.pdf', file: 'base64' }
      });
    });

    it('should emit value without content when no file is selected', () => {
      spyOn(component.submitted, 'emit');
      component.isUpdateMode = true;
      component.ngOnInit();
      component.materialForm.patchValue({
        title: 'Test Title',
        subject: 'subject-123',
        description: 'Test Description',
        file: null
      });

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith({
        title: 'Test Title',
        subjectId: 'subject-123',
        description: 'Test Description'
      });
    });

    it('should log DTO before emitting', () => {
      const consoleLogSpy = spyOn(console, 'log');
      spyOn(component.submitted, 'emit');
      component.materialForm.patchValue({
        title: 'Test Title',
        subject: 'subject-123',
        file: 'test.pdf'
      });
      component.content = { fileName: 'test.pdf', file: 'base64' };

      component.submit();

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('onSubjectChange', () => {
    it('should set disableDefault to true', () => {
      component.disableDefault = false;

      component.onSubjectChange();

      expect(component.disableDefault).toBe(true);
    });
  });
});
