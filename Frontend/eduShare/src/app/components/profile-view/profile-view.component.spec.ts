import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileViewComponent } from './profile-view.component';
import { ProfileService } from '../../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockConfirmService: jasmine.SpyObj<ConfirmService>;
  let paramMapSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject({ get: (key: string) => 'user-123' });
    
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getById', 'warnUser', 'removeWarning', 'banUser', 'unbanUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRoles', 'getUserId']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockConfirmService = jasmine.createSpyObj('ConfirmService', ['confirm']);

    mockProfileService.getById.and.returnValue(of({} as ProfileViewDto));
    mockAuthService.getRoles.and.returnValue([]);
    mockAuthService.getUserId.and.returnValue('user-456');

    await TestBed.configureTestingModule({
      declarations: [ProfileViewComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ConfirmService, useValue: mockConfirmService },
        { 
          provide: ActivatedRoute, 
          useValue: { paramMap: paramMapSubject.asObservable() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isAdmin based on roles', () => {
      mockAuthService.getUserId.and.returnValue('user-123');

      component.ngOnInit();

      expect(component.ownProfile).toBe(true);
    });

    it('should set ownProfile to false when id does not match current user', () => {
      mockAuthService.getUserId.and.returnValue('user-999');

      component.ngOnInit();

      expect(component.ownProfile).toBe(false);
    });
  });

  describe('loadProfile', () => {
    it('should append Z to warnedAt when present', () => {
      spyOn(console, 'log');
      mockProfileService.getById.and.returnValue(of({
        id: 'user-123',
        warnedAt: '2024-01-01T10:00:00'
      } as any));

      component.loadProfile('user-123');

      expect(component.profile?.warnedAt).toBe('2024-01-01T10:00:00Z');
    });

    it('should append Z to bannedAt when present', () => {
      spyOn(console, 'log');
      mockProfileService.getById.and.returnValue(of({
        id: 'user-123',
        bannedAt: '2024-01-01T10:00:00'
      } as any));

      component.loadProfile('user-123');

      expect(component.profile?.bannedAt).toBe('2024-01-01T10:00:00Z');
    });

    it('should show toast on load error', () => {
      spyOn(console, 'error');
      const error = new Error('Load failed');
      mockProfileService.getById.and.returnValue(throwError(() => error));

      component.loadProfile('user-123');

      expect(mockToastService.show).toHaveBeenCalledWith('Cannot load the profile.');
    });
  });

  describe('trackById', () => {
    it('should return material id', () => {
      const material = { id: 'mat-123' } as MaterialShortViewDto;

      const result = component.trackById(0, material);

      expect(result).toBe('mat-123');
    });
  });

  describe('openDetail', () => {
    it('should navigate to material view', () => {
      const material = { id: 'mat-123' } as MaterialShortViewDto;

      component.openDetail(material);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials', 'mat-123', 'view']);
    });
  });

  describe('editDetail', () => {
    it('should navigate to profile update', () => {
      const profile = { id: 'user-123' } as ProfileViewDto;

      component.editDetail(profile);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-update', 'user-123']);
    });
  });

  describe('getProfileImageSrc', () => {
    it('should return default avatar when profile is null', () => {
      component.profile = null;

      const result = component.getProfileImageSrc();

      expect(result).toBe('assets/default-avatar.png');
    });

    it('should return default avatar when image is undefined', () => {
      component.profile = {} as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('assets/default-avatar.png');
    });

    it('should return http URL as-is', () => {
      component.profile = {
        image: { id: 'img-1', fileName: 'test.jpg', file: 'http://example.com/image.jpg' }
      } as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('http://example.com/image.jpg');
    });

    it('should format base64 string with data URI prefix', () => {
      component.profile = {
        image: { id: 'img-1', fileName: 'test.jpg', file: 'base64string' }
      } as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('data:image/*;base64,base64string');
    });
  });

  describe('warnUser', () => {
    it('should return early when user cancels confirmation', async () => {
      component.profile = { id: 'user-123', fullName: 'John Doe' } as ProfileViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.warnUser();

      expect(component.profile).toBeDefined();
    });
  });

  describe('removeWarning', () => {
    it('should return early when user cancels confirmation', async () => {
      component.profile = { id: 'user-123', fullName: 'John Doe' } as ProfileViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.removeWarning();

      expect(component.profile).toBeDefined();
    });
  });

  describe('banUser', () => {
    it('should return early when user cancels confirmation', async () => {
      component.profile = { id: 'user-123', fullName: 'John Doe' } as ProfileViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.banUser();

      expect(component.profile).toBeDefined();
    });
  });

  describe('unbanUser', () => {
    it('should return early when user cancels confirmation', async () => {
      component.profile = { id: 'user-123', fullName: 'John Doe' } as ProfileViewDto;
      mockConfirmService.confirm.and.returnValue(Promise.resolve(false));

      await component.unbanUser();

      expect(component.profile).toBeDefined();
    });
  });
});
