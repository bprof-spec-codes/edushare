import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmComponent } from './confirm.component';
import { ConfirmService, ConfirmData } from '../../services/confirm.service';
import { Subject } from 'rxjs';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;
  let mockConfirmService: any;
  let confirmSubject: Subject<ConfirmData>;

  beforeEach(async () => {
    confirmSubject = new Subject<ConfirmData>();
    mockConfirmService = {
      confirmState$: confirmSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [ConfirmComponent],
      providers: [
        { provide: ConfirmService, useValue: mockConfirmService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Modal Display Logic', () => {
    it('should show modal and set message when service emits data', () => {
      const mockResolve = jasmine.createSpy('resolve');
      const data: ConfirmData = {
        message: 'Are you sure?',
        resolve: mockResolve
      };

      component.ngOnInit();
      confirmSubject.next(data);

      expect(component.showModal).toBe(true);
      expect(component.message).toBe('Are you sure?');
    });
  });

  describe('User Interactions', () => {
    it('should hide modal and resolve true on confirm', () => {
      const mockResolve = jasmine.createSpy('resolve');
      component.showModal = true;
      component['currentResolve'] = mockResolve;

      component.onConfirm();

      expect(component.showModal).toBe(false);
      expect(mockResolve).toHaveBeenCalledWith(true);
    });

    it('should hide modal and resolve false on cancel', () => {
      const mockResolve = jasmine.createSpy('resolve');
      component.showModal = true;
      component['currentResolve'] = mockResolve;

      component.onCancel();

      expect(component.showModal).toBe(false);
      expect(mockResolve).toHaveBeenCalledWith(false);
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      component.ngOnInit();
      const subscription = component['subscription'];
      spyOn(subscription!, 'unsubscribe');

      component.ngOnDestroy();

      expect(subscription!.unsubscribe).toHaveBeenCalled();
    });
  });
});
