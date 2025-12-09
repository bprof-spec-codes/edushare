import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingCreateModalComponent } from './rating-create-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RatingCreateModalComponent', () => {
  let component: RatingCreateModalComponent;
  let fixture: ComponentFixture<RatingCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingCreateModalComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize createForm with rate and comment controls', () => {
      expect(component.createForm).toBeDefined();
      expect(component.createForm.get('rate')).toBeDefined();
      expect(component.createForm.get('comment')).toBeDefined();
    });

    it('should set rate validators to required, max 5, min 1', () => {
      const rateControl = component.createForm.get('rate');
      
      rateControl?.setValue(0);
      expect(rateControl?.hasError('min')).toBe(true);

      rateControl?.setValue(6);
      expect(rateControl?.hasError('max')).toBe(true);

      rateControl?.setValue(3);
      expect(rateControl?.valid).toBe(true);
    });

    it('should set comment validator to maxLength 1000', () => {
      const commentControl = component.createForm.get('comment');
      
      commentControl?.setValue('a'.repeat(1001));
      expect(commentControl?.hasError('maxlength')).toBe(true);

      commentControl?.setValue('a'.repeat(1000));
      expect(commentControl?.valid).toBe(true);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should reset form when open is true', () => {
      component.createForm.get('rate')?.setValue(5);
      component.createForm.get('comment')?.setValue('test comment');
      component.hover = 3;

      component.open = true;
      component.ngOnChanges();

      expect(component.createForm.value.rate).toBe(0);
      expect(component.createForm.value.comment).toBe('');
      expect(component.hover).toBe(0);
    });

    it('should not reset form when open is false', () => {
      component.createForm.get('rate')?.setValue(5);
      component.createForm.get('comment')?.setValue('test comment');

      component.open = false;
      component.ngOnChanges();

      expect(component.createForm.value.rate).toBe(5);
      expect(component.createForm.value.comment).toBe('test comment');
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.materialid = 'mat123';
    });

    it('should emit save with RatingCreateDto when form is valid', () => {
      spyOn(component.save, 'emit');
      component.createForm.get('rate')?.setValue(4);
      component.createForm.get('comment')?.setValue('  Great material  ');

      component.submit();

      expect(component.save.emit).toHaveBeenCalledWith({
        materialId: 'mat123',
        rate: 4,
        comment: 'Great material'
      });
    });

    it('should use empty string for materialId when materialid is undefined', () => {
      spyOn(component.save, 'emit');
      component.materialid = undefined;
      component.createForm.get('rate')?.setValue(3);
      component.createForm.get('comment')?.setValue('Test');

      component.submit();

      expect(component.save.emit).toHaveBeenCalledWith({
        materialId: '',
        rate: 3,
        comment: 'Test'
      });
    });

    it('should trim comment before emitting', () => {
      spyOn(component.save, 'emit');
      component.createForm.get('rate')?.setValue(5);
      component.createForm.get('comment')?.setValue('   spaces everywhere   ');

      component.submit();

      const emittedDto = (component.save.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedDto.comment).toBe('spaces everywhere');
    });

    it('should use empty string when comment is empty after trim', () => {
      spyOn(component.save, 'emit');
      component.createForm.get('rate')?.setValue(5);
      component.createForm.get('comment')?.setValue('   ');

      component.submit();

      const emittedDto = (component.save.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedDto.comment).toBe('');
    });

    it('should mark all controls as touched when form is invalid', () => {
      component.createForm.get('rate')?.setValue(0);
      spyOn(component.createForm, 'markAllAsTouched');

      component.submit();

      expect(component.createForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not emit save when form is invalid', () => {
      spyOn(component.save, 'emit');
      component.createForm.get('rate')?.setValue(0);

      component.submit();

      expect(component.save.emit).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should emit close event', () => {
      spyOn(component.close, 'emit');

      component.onCancel();

      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('onStarEnter', () => {
    it('should set hover to star value when not loading', () => {
      component.loading = false;

      component.onStarEnter(3);

      expect(component.hover).toBe(3);
    });

    it('should not set hover when loading is true', () => {
      component.loading = true;
      component.hover = 0;

      component.onStarEnter(3);

      expect(component.hover).toBe(0);
    });
  });

  describe('onStarLeave', () => {
    it('should reset hover to 0', () => {
      component.hover = 5;

      component.onStarLeave();

      expect(component.hover).toBe(0);
    });
  });

  describe('onStarClick', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set rate value when not loading', () => {
      component.loading = false;

      component.onStarClick(4);

      expect(component.createForm.get('rate')?.value).toBe(4);
    });

    it('should mark rate as touched when clicked', () => {
      component.loading = false;

      component.onStarClick(3);

      expect(component.createForm.get('rate')?.touched).toBe(true);
    });

    it('should not set rate when loading is true', () => {
      component.loading = true;
      component.createForm.get('rate')?.setValue(2);

      component.onStarClick(5);

      expect(component.createForm.get('rate')?.value).toBe(2);
    });
  });

  describe('isStarOn', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true when hover is set and star is less than or equal to hover', () => {
      component.hover = 3;
      component.createForm.get('rate')?.setValue(5);

      expect(component.isStarOn(2)).toBe(true);
      expect(component.isStarOn(3)).toBe(true);
    });

    it('should return false when hover is set and star is greater than hover', () => {
      component.hover = 3;
      component.createForm.get('rate')?.setValue(5);

      expect(component.isStarOn(4)).toBe(false);
    });

    it('should use rate value when hover is 0', () => {
      component.hover = 0;
      component.createForm.get('rate')?.setValue(4);

      expect(component.isStarOn(3)).toBe(true);
      expect(component.isStarOn(4)).toBe(true);
      expect(component.isStarOn(5)).toBe(false);
    });

    it('should return false when both hover and rate are 0', () => {
      component.hover = 0;
      component.createForm.get('rate')?.setValue(0);

      expect(component.isStarOn(1)).toBe(false);
    });
  });
});
