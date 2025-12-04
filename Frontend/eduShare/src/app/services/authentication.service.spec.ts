import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './authentication.service';

describe('AuthService Logic Tests', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token Decoding Logic', () => {
    it('should decode a valid JWT token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCBVc2VyIn0.dummy';
      const payload = service.decodePayload(token);
      
      expect(payload).toBeTruthy();
      expect(payload.sub).toBe('123');
      expect(payload.name).toBe('Test User');
    });

    it('should return null for invalid token', () => {
      expect(service.decodePayload('invalid-token')).toBeNull();
    });
  });

  describe('Session Validation Logic', () => {
    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true for valid non-expired token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createMockToken({ exp: futureExp });
      localStorage.setItem('edu_token', token);
      
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false for expired token', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const token = createMockToken({ exp: pastExp });
      localStorage.setItem('edu_token', token);
      
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('Role Extraction Logic', () => {
    it('should return empty array when no token exists', () => {
      expect(service.getRoles()).toEqual([]);
    });

    it('should extract single role from token', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Teacher'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getRoles()).toEqual(['Teacher']);
    });

    it('should extract multiple roles from array', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['Teacher', 'Admin']
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getRoles()).toEqual(['Teacher', 'Admin']);
    });
  });

  describe('Role Check Logic', () => {
    it('should return true if user has teacher role', () => {
      const token = createMockToken({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Teacher'
      });
      localStorage.setItem('edu_token', token);
      
      expect(service.isTeacher()).toBe(true);
    });

    it('should return true if user has admin role', () => {
      const token = createMockToken({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin'
      });
      localStorage.setItem('edu_token', token);
      
      expect(service.isAdmin()).toBe(true);
    });
  });

  describe('User ID Extraction Logic', () => {
    it('should return null when no token exists', () => {
      expect(service.getUserId()).toBeNull();
    });

    it('should extract user ID from token', () => {
      const userId = 'user-123';
      const token = createMockToken({ [AuthService.NAME_ID_CLAIM]: userId });
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBe(userId);
    });

    it('should return null when user ID claim is missing', () => {
      const token = createMockToken({ sub: '123', name: 'Test User' });
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBeNull();
    });
  });
});

/**
 * Helper function to create a mock JWT token with the given payload
 */
function createMockToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
