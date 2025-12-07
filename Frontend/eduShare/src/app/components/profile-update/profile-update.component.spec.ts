import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileUpdateComponent } from './profile-update.component';
import { ProfileService } from '../../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { UpdateProfileDto } from '../../dtos/update-profile-dto';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getById', 'update']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFileService = jasmine.createSpyObj('FileService', ['toFileContent']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('user-123')
        }
      }
    };

    mockProfileService.getById.and.returnValue(of({
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Doe John',
      image: null,
      materials: []
    } as unknown as ProfileViewDto));

    await TestBed.configureTestingModule({
      declarations: [ProfileUpdateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: FileService, useValue: mockFileService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should show toast and return when id is null', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      component.ngOnInit();

      expect(mockToastService.show).toHaveBeenCalledWith('Érvénytelen azonosító.');
    });

    it('should extract and set id from route params', () => {
      component.ngOnInit();

      expect(component.id).toBe('user-123');
    });

    it('should split fullName into firstname and lastname', () => {
      component.ngOnInit();

      expect(component.profile?.firstname).toBe('John');
      expect(component.profile?.lastname).toBe('Doe');
    });

    it('should show toast on profile load error', () => {
      spyOn(console, 'error');
      const error = new Error('Load failed');
      mockProfileService.getById.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(mockToastService.show).toHaveBeenCalledWith('Nem sikerült betölteni a profilt.');
    });
  });

  describe('onUpdate', () => {
    beforeEach(() => {
      component.ngOnInit();
      mockProfileService.update.and.returnValue(of({} as any));
    });

    it('should return early when profile is null', () => {
      component.profile = null;

      component.onUpdate();

      expect(mockProfileService.update).not.toHaveBeenCalled();
    });

    it('should return early when id is undefined', () => {
      component.id = undefined as any;

      component.onUpdate();

      expect(mockProfileService.update).not.toHaveBeenCalled();
    });

    it('should use new image when file is selected', () => {
      component.selectedFile = new File(['content'], 'test.jpg');
      component.selectedFileDataUrl = 'base64data';
      component.updateForm.patchValue({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      });

      component.onUpdate();

      const callArgs = mockProfileService.update.calls.mostRecent().args;
      expect(callArgs[1].image?.fileName).toBe('test.jpg');
      expect(callArgs[1].image?.file).toBe('base64data');
    });

    it('should use existing image when no file is selected', () => {
      component.selectedFileDataUrl = null;
      component.profile!.image = { id: 'img-123', fileName: 'old.jpg', file: 'oldbase64' };
      component.updateForm.patchValue({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      });

      component.onUpdate();

      const callArgs = mockProfileService.update.calls.mostRecent().args;
      expect(callArgs[1].image?.fileName).toBe('old.jpg');
    });

    it('should show success toast and navigate on successful update', () => {
      component.updateForm.patchValue({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      });

      component.onUpdate();

      expect(mockToastService.show).toHaveBeenCalledWith('Profil sikeresen módosítva!');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', 'user-123']);
    });

    it('should show error toast on update failure', () => {
      spyOn(console, 'error');
      const error = new Error('Update failed');
      mockProfileService.update.and.returnValue(throwError(() => error));
      component.updateForm.patchValue({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      });

      component.onUpdate();

      expect(mockToastService.show).toHaveBeenCalledWith('Nem sikerült módosítani a profilt.');
    });
  });

  describe('onFileSelected', () => {
    it('should return early when no file is selected', async () => {
      const event = { target: { files: [] } } as unknown as Event;

      await component.onFileSelected(event);

      expect(mockFileService.toFileContent).not.toHaveBeenCalled();
    });

    it('should show toast for invalid file extension', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file], value: '' } } as unknown as Event;

      await component.onFileSelected(event);

      expect(mockToastService.show).toHaveBeenCalledWith('Csak PNG és JPEG formátum engedélyezett!');
      expect(component.selectedFileDataUrl).toBeNull();
    });

    it('should accept jpg file', async () => {
      component.ngOnInit();
      component.profile = { email: 'test@test.com', firstname: 'John', lastname: 'Doe', image: undefined as any };
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } } as unknown as Event;
      mockFileService.toFileContent.and.returnValue(Promise.resolve({ fileName: 'test.jpg', file: 'base64data' }));

      await component.onFileSelected(event);

      expect(component.selectedFile).toBe(file);
      expect(component.selectedFileDataUrl).toBe('base64data');
    });

    it('should accept png file', async () => {
      component.ngOnInit();
      component.profile = { email: 'test@test.com', firstname: 'John', lastname: 'Doe', image: undefined as any };
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;
      mockFileService.toFileContent.and.returnValue(Promise.resolve({ fileName: 'test.png', file: 'base64data' }));

      await component.onFileSelected(event);

      expect(component.selectedFile).toBe(file);
      expect(component.selectedFileDataUrl).toBe('base64data');
    });
  });

  describe('getProfileImageSrc', () => {
    it('should return default avatar when no image exists', () => {
      component.content = undefined;
      component.profile = { email: 'test@test.com', firstname: 'John', lastname: 'Doe', image: undefined as any };

      const result = component.getProfileImageSrc();

      expect(result).toBe('assets/default-avatar.png');
    });

    it('should return http URL as-is', () => {
      component.content = undefined;
      component.profile = {
        email: 'test@test.com',
        firstname: 'John',
        lastname: 'Doe',
        image: { id: 'img-123', fileName: 'test.jpg', file: 'http://example.com/image.jpg' }
      };

      const result = component.getProfileImageSrc();

      expect(result).toBe('http://example.com/image.jpg');
    });

    it('should format base64 string with data URI prefix', () => {
      component.content = undefined;
      component.profile = {
        email: 'test@test.com',
        firstname: 'John',
        lastname: 'Doe',
        image: { id: 'img-123', fileName: 'test.jpg', file: 'base64string' }
      };

      const result = component.getProfileImageSrc();

      expect(result).toBe('data:image/*;base64,base64string');
    });

    it('should prioritize content file over profile image', () => {
      component.content = { id: 'img-1', fileName: 'new.jpg', file: 'newbase64' };
      component.profile = {
        email: 'test@test.com',
        firstname: 'John',
        lastname: 'Doe',
        image: { id: 'img-2', fileName: 'old.jpg', file: 'oldbase64' }
      };

      const result = component.getProfileImageSrc();

      expect(result).toBe('data:image/*;base64,newbase64');
    });
  });
});
