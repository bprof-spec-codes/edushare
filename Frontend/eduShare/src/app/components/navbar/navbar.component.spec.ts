import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { FavMaterialService } from '../../services/fav-material.service';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProfileViewDto } from '../../dtos/profile-view-dto';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFavMaterialService: jasmine.SpyObj<FavMaterialService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUserId', 'getRoles', 'logout']);
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getCurrentProfile'], {
      currentProfile$: of(null)
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFavMaterialService = jasmine.createSpyObj('FavMaterialService', ['clear']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockModalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    mockAuthService.isLoggedIn.and.returnValue(false);
    mockAuthService.getUserId.and.returnValue(null);
    mockAuthService.getRoles.and.returnValue([]);
    mockProfileService.getCurrentProfile.and.returnValue(of({} as ProfileViewDto));

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: FavMaterialService, useValue: mockFavMaterialService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NgbModal, useValue: mockModalService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isLoggedIn from auth service', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);

      component.ngOnInit();

      expect(component.isLoggedIn).toBe(true);
    });

    it('should set isTeacher to true when user has Teacher role', () => {
      mockAuthService.getRoles.and.returnValue(['Teacher']);

      component.ngOnInit();

      expect(component.isTeacher).toBe(true);
    });

    it('should set isTeacher to true when user has Admin role', () => {
      mockAuthService.getRoles.and.returnValue(['Admin']);

      component.ngOnInit();

      expect(component.isTeacher).toBe(true);
    });

    it('should set isAdmin to true when user has Admin role', () => {
      mockAuthService.getRoles.and.returnValue(['Admin']);

      component.ngOnInit();

      expect(component.isAdmin).toBe(true);
    });

    it('should set isAdmin to false when user has only Teacher role', () => {
      mockAuthService.getRoles.and.returnValue(['Teacher']);

      component.ngOnInit();

      expect(component.isAdmin).toBe(false);
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
        image: { file: 'http://example.com/image.jpg' }
      } as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('http://example.com/image.jpg');
    });

    it('should return https URL as-is', () => {
      component.profile = {
        image: { file: 'https://example.com/image.jpg' }
      } as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should format base64 string with data URI prefix', () => {
      component.profile = {
        image: { file: 'base64string' }
      } as ProfileViewDto;

      const result = component.getProfileImageSrc();

      expect(result).toBe('data:image/*;base64,base64string');
    });
  });

  describe('openFavs', () => {
    it('should navigate to fav-materials', () => {
      component.openFavs();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/fav-materials']);
    });
  });

  describe('openProfile', () => {
    it('should navigate to profile view with user id', () => {
      mockAuthService.getUserId.and.returnValue('user-123');

      component.openProfile();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile-view', 'user-123']);
    });
  });

  describe('ngOnChanges', () => {
    it('should update isLoggedIn', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      component.isLoggedIn = false;

      component.ngOnChanges();

      expect(component.isLoggedIn).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear favorites and logout', () => {
      component.logout();

      expect(mockFavMaterialService.clear).toHaveBeenCalled();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});
