import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FavMaterialService } from '../../../services/fav-material.service';
import { BanMonitorService } from '../../../services/ban-monitor.service';
import { of, throwError, EMPTY } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: any;
  let mockFavService: jasmine.SpyObj<FavMaterialService>;
  let mockBanMonitorService: jasmine.SpyObj<BanMonitorService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'saveToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.events = EMPTY;
    mockFavService = jasmine.createSpyObj('FavMaterialService', ['getAll']);
    mockBanMonitorService = jasmine.createSpyObj('BanMonitorService', ['startMonitoring']);
    mockActivatedRoute = {
      snapshot: { params: {}, queryParams: {} },
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: FavMaterialService, useValue: mockFavService },
        { provide: BanMonitorService, useValue: mockBanMonitorService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLogin', () => {
    it('should clear error and set loading on login', () => {
      component.error = 'Previous error';
      mockAuthService.login.and.returnValue(of({ token: 'test-token' }));
      mockFavService.getAll.and.returnValue(of([]));

      component.onLogin();

      expect(component.error).toBe('');
    });

    it('should handle successful login with token', () => {
      const token = 'test-token';
      mockAuthService.login.and.returnValue(of({ token }));
      mockFavService.getAll.and.returnValue(of([]));

      component.onLogin();

      expect(mockAuthService.saveToken).toHaveBeenCalledWith(token);
      expect(mockFavService.getAll).toHaveBeenCalled();
      expect(mockBanMonitorService.startMonitoring).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/homepage']);
    });

    it('should handle Token with uppercase property', () => {
      const token = 'test-token';
      mockAuthService.login.and.returnValue(of({ Token: token }));
      mockFavService.getAll.and.returnValue(of([]));

      component.onLogin();

      expect(mockAuthService.saveToken).toHaveBeenCalledWith(token);
    });

    it('should set error when no token in response', () => {
      mockAuthService.login.and.returnValue(of({}));

      component.onLogin();

      expect(component.error).toBe('Hibás válasz a szervertől.');
      expect(component.loading).toBe(false);
      expect(mockAuthService.saveToken).not.toHaveBeenCalled();
    });

    it('should handle login error with message', () => {
      const errorMessage = 'Invalid credentials';
      mockAuthService.login.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));

      component.onLogin();

      expect(component.error).toBe(errorMessage);
      expect(component.loading).toBe(false);
    });

    it('should use default error message when none provided', () => {
      mockAuthService.login.and.returnValue(throwError(() => ({})));

      component.onLogin();

      expect(component.error).toBe('Hibás email vagy jelszó.');
      expect(component.loading).toBe(false);
    });
  });

  describe('goToRegister', () => {
    it('should navigate to register page', () => {
      component.goToRegister();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });
  });
});
