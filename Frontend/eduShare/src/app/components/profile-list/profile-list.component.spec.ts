import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileListComponent } from './profile-list.component';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';

describe('ProfileListComponent', () => {
  let component: ProfileListComponent;
  let fixture: ComponentFixture<ProfileListComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['loadAll', 'grantAdmin', 'grantTeacher', 'revokeRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRoles']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    mockProfileService.loadAll.and.returnValue(of([]));
    mockAuthService.getRoles.and.returnValue([]);

    await TestBed.configureTestingModule({
      declarations: [ProfileListComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set roles from auth service', () => {
      mockAuthService.getRoles.and.returnValue(['Admin', 'Teacher']);

      component.ngOnInit();

      expect(component.roles).toEqual(['Admin', 'Teacher']);
    });
  });

  describe('loadProfiles', () => {
    it('should set error message on load failure', () => {
      spyOn(console, 'error');
      const error = new Error('Load failed');
      mockProfileService.loadAll.and.returnValue(throwError(() => error));

      component.loadProfiles();

      expect(component.error).toBe('Cannot load in users!');
    });

    it('should set loading to false on load failure', () => {
      spyOn(console, 'error');
      const error = new Error('Load failed');
      mockProfileService.loadAll.and.returnValue(throwError(() => error));

      component.loadProfiles();

      expect(component.loading).toBe(false);
    });
  });

  describe('openDetail', () => {
    it('should navigate to profile view', () => {
      component.openDetail('profile-123');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', 'profile-123']);
    });
  });

  describe('hasRoleAdmin', () => {
    it('should return true when roles include Admin', () => {
      component.roles = ['Admin'];

      const result = component.hasRoleAdmin();

      expect(result).toBe(true);
    });

    it('should return true when roles include Admin and other roles', () => {
      component.roles = ['Teacher', 'Admin', 'User'];

      const result = component.hasRoleAdmin();

      expect(result).toBe(true);
    });

    it('should return false when roles do not include Admin', () => {
      component.roles = ['Teacher', 'User'];

      const result = component.hasRoleAdmin();

      expect(result).toBe(false);
    });

    it('should return false when roles array is empty', () => {
      component.roles = [];

      const result = component.hasRoleAdmin();

      expect(result).toBe(false);
    });
  });

  describe('grantAdmin', () => {
    it('should show success toast on successful grant', () => {
      mockProfileService.grantAdmin.and.returnValue(of(void 0));

      component.grantAdmin('user-123');

      expect(mockToastService.show).toHaveBeenCalledWith('Admin added succesfully!');
    });
  });

  describe('grantTeacher', () => {
    it('should show success toast on successful grant', () => {
      mockProfileService.grantTeacher.and.returnValue(of(void 0));

      component.grantTeacher('user-123');

      expect(mockToastService.show).toHaveBeenCalledWith('Teacher added succesfully!');
    });
  });

  describe('revokeRole', () => {
    it('should show success toast on successful revoke', () => {
      mockProfileService.revokeRole.and.returnValue(of(void 0));

      component.revokeRole('user-123');

      expect(mockToastService.show).toHaveBeenCalledWith('Roles deleted succesfully!');
    });

    it('should show error message toast on revoke failure', () => {
      spyOn(console, 'log');
      const error = { error: { message: 'Cannot revoke role' } };
      mockProfileService.revokeRole.and.returnValue(throwError(() => error));

      component.revokeRole('user-123');

      expect(mockToastService.show).toHaveBeenCalledWith('Cannot revoke role');
    });
  });
});
