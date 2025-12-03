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
      // JWT with payload: { "sub": "123", "name": "Test User" }
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCBVc2VyIn0.dummy';
      const payload = service.decodePayload(token);
      
      expect(payload).toBeTruthy();
      expect(payload.sub).toBe('123');
      expect(payload.name).toBe('Test User');
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token';
      expect(service.decodePayload(invalidToken)).toBeNull();
    });

    it('should return null for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      expect(service.decodePayload(malformedToken)).toBeNull();
    });

    it('should handle token with special characters', () => {
      // JWT with base64url encoding (contains - and _)
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0IjoidmFsdWUifQ.dummy';
      const payload = service.decodePayload(token);
      expect(payload).toBeTruthy();
    });
  });

  describe('Session Validation Logic', () => {
    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return false when token is invalid', () => {
      localStorage.setItem('edu_token', 'invalid-token');
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true for valid non-expired token', () => {
      // Token expires in the future (1 hour from now)
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureExp };
      const token = createMockToken(payload);
      
      localStorage.setItem('edu_token', token);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false for expired token', () => {
      // Token expired 1 hour ago
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: pastExp };
      const token = createMockToken(payload);
      
      localStorage.setItem('edu_token', token);
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true for token without expiration', () => {
      const payload = { sub: '123' };
      const token = createMockToken(payload);
      
      localStorage.setItem('edu_token', token);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('Role Extraction Logic', () => {
    it('should return empty array when no token exists', () => {
      expect(service.getRoles()).toEqual([]);
    });

    it('should return empty array for invalid token', () => {
      localStorage.setItem('edu_token', 'invalid-token');
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

    it('should handle multiple role claims', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Teacher',
        'customapp/role': 'Moderator'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      const roles = service.getRoles();
      expect(roles).toContain('Teacher');
      expect(roles).toContain('Moderator');
    });

    it('should return empty array when no role claims exist', () => {
      const payload = { sub: '123', name: 'Test User' };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getRoles()).toEqual([]);
    });
  });

  describe('Role Check Logic', () => {
    it('should return true if user is a teacher', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Teacher'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.isTeacher()).toBe(true);
    });

    it('should return false if user is not a teacher', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Student'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.isTeacher()).toBe(false);
    });

    it('should return true if user is an admin', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.isAdmin()).toBe(true);
    });

    it('should return false if user is not an admin', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Teacher'
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.isAdmin()).toBe(false);
    });

    it('should handle user with multiple roles', () => {
      const payload = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['Teacher', 'Admin']
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.isTeacher()).toBe(true);
      expect(service.isAdmin()).toBe(true);
    });
  });

  describe('User ID Extraction Logic', () => {
    it('should return null when no token exists', () => {
      expect(service.getUserId()).toBeNull();
    });

    it('should return null for invalid token', () => {
      localStorage.setItem('edu_token', 'invalid-token');
      expect(service.getUserId()).toBeNull();
    });

    it('should extract user ID from token', () => {
      const userId = 'user-123';
      const payload = {
        [AuthService.NAME_ID_CLAIM]: userId
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBe(userId);
    });

    it('should return null when user ID claim is missing', () => {
      const payload = { sub: '123', name: 'Test User' };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBeNull();
    });

    it('should return null for empty string user ID', () => {
      const payload = {
        [AuthService.NAME_ID_CLAIM]: ''
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBeNull();
    });

    it('should return null for whitespace-only user ID', () => {
      const payload = {
        [AuthService.NAME_ID_CLAIM]: '   '
      };
      const token = createMockToken(payload);
      localStorage.setItem('edu_token', token);
      
      expect(service.getUserId()).toBeNull();
    });

    it('should return null when user ID is not a string', () => {
      const payload = {
        [AuthService.NAME_ID_CLAIM]: 123
      };
      const token = createMockToken(payload);
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
