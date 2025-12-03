import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BanMonitorService } from './ban-monitor.service';
import { ProfileService } from './profile.service';
import { AuthService } from './authentication.service';
import { ToastService } from './toast.service';
import { of, throwError } from 'rxjs';

describe('BanMonitorService Logic Tests', () => {
  let service: BanMonitorService;
  let profileService: jasmine.SpyObj<ProfileService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getById']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        BanMonitorService,
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    service = TestBed.inject(BanMonitorService);
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  afterEach(() => {
    service.stopMonitoring();
  });

  describe('Monitoring Lifecycle Logic', () => {
    it('should not start monitoring twice', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: false } as any));

      service.startMonitoring();
      const firstCallCount = profileService.getById.calls.count();
      
      service.startMonitoring();
      tick(1000);
      
      // Should not increase call count if already monitoring
      expect(profileService.getById.calls.count()).toBe(firstCallCount);
      
      discardPeriodicTasks();
    }));

    it('should allow restarting monitoring after stopping', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: false } as any));

      service.startMonitoring();
      service.stopMonitoring();
      
      profileService.getById.calls.reset();
      
      service.startMonitoring();
      
      expect(profileService.getById.calls.count()).toBeGreaterThan(0);
      
      discardPeriodicTasks();
    }));
  });

  describe('Ban Status Check Logic', () => {
    it('should not check ban status when user ID is null', fakeAsync(() => {
      authService.getUserId.and.returnValue(null);

      service.startMonitoring();
      tick(1000);

      expect(profileService.getById).not.toHaveBeenCalled();
      
      discardPeriodicTasks();
    }));

    it('should not trigger ban handling when user is not banned', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: false } as any));

      service.startMonitoring();
      tick(1000);

      expect(toastService.show).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      
      discardPeriodicTasks();
    }));
  });

  describe('Banned User Handling Logic', () => {
    it('should execute ban handling when user is banned', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: true } as any));

      service.startMonitoring();
      tick(1000);

      expect(toastService.show).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('Periodic Check Logic', () => {
    it('should check ban status immediately on start', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: false } as any));

      service.startMonitoring();

      expect(profileService.getById).toHaveBeenCalledWith('user-123');
      
      discardPeriodicTasks();
    }));

    it('should continue checking periodically if user is not banned', fakeAsync(() => {
      authService.getUserId.and.returnValue('user-123');
      profileService.getById.and.returnValue(of({ isBanned: false } as any));

      service.startMonitoring();
      
      const initialCallCount = profileService.getById.calls.count();
      
      tick(60000); // Wait for one interval
      
      expect(profileService.getById.calls.count()).toBeGreaterThan(initialCallCount);
      
      discardPeriodicTasks();
    }));
  });
});
