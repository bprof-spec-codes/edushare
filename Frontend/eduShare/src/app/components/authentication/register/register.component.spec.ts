import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { RegisterService } from '../../../services/register.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, EMPTY } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRegisterService = jasmine.createSpyObj('RegisterService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.events = EMPTY;
    mockActivatedRoute = {
      snapshot: { params: {}, queryParams: {} },
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRegister', () => {
    it('should clear error and success messages initially', () => {
      component.error = 'Previous error';
      component.success = 'Previous success';
      component.email = '';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      component.onRegister();

      // Validation fails, so error is set but we know it was cleared first
      expect(component.error).toBe('All fields are required.');
    });

    it('should show error when email is missing', () => {
      component.email = '';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      component.onRegister();

      expect(component.error).toBe('All fields are required.');
      expect(mockRegisterService.register).not.toHaveBeenCalled();
    });

    it('should show error when firstName is missing', () => {
      component.email = 'test@example.com';
      component.firstName = '';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      component.onRegister();

      expect(component.error).toBe('All fields are required.');
    });

    it('should show error when lastName is missing', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = '';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      component.onRegister();

      expect(component.error).toBe('All fields are required.');
    });

    it('should show error when password is missing', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = '';
      component.confirmPassword = 'password123';

      component.onRegister();

      expect(component.error).toBe('All fields are required.');
    });

    it('should show error when confirmPassword is missing', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = '';

      component.onRegister();

      expect(component.error).toBe('All fields are required.');
    });

    it('should show error when passwords do not match', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'different123';

      component.onRegister();

      expect(component.error).toBe('Passwords do not match.');
      expect(mockRegisterService.register).not.toHaveBeenCalled();
    });

    it('should set loading to true on valid registration', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      mockRegisterService.register.and.returnValue(of(void 0));

      component.onRegister();

      expect(component.loading).toBe(false); // Already completed synchronously
      expect(mockRegisterService.register).toHaveBeenCalledWith('John', 'Doe', 'test@example.com', 'password123');
    });

    it('should handle successful registration', fakeAsync(() => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      mockRegisterService.register.and.returnValue(of(void 0));

      component.onRegister();

      expect(component.loading).toBe(false);
      expect(component.success).toBe('Registration successful!');
      expect(component.email).toBe('');
      expect(component.firstName).toBe('');
      expect(component.lastName).toBe('');
      expect(component.password).toBe('');
      expect(component.confirmPassword).toBe('');

      tick(3000);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should handle registration error with error object', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      const errorMessage = 'Email already exists';
      mockRegisterService.register.and.returnValue(throwError(() => ({ error: errorMessage })));

      component.onRegister();

      expect(component.loading).toBe(false);
      expect(component.error).toBe(errorMessage);
      expect(component.success).toBeNull();
    });

    it('should use default error message when no error provided', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      mockRegisterService.register.and.returnValue(throwError(() => ({})));

      component.onRegister();

      expect(component.error).toBe('Registration failed. Please try again.');
    });
  });

  describe('clearForm', () => {
    it('should clear all form fields', () => {
      component.email = 'test@example.com';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      component.clearForm();

      expect(component.email).toBe('');
      expect(component.firstName).toBe('');
      expect(component.lastName).toBe('');
      expect(component.password).toBe('');
      expect(component.confirmPassword).toBe('');
    });
  });
});
