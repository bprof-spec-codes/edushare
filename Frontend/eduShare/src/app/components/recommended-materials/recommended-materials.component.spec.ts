import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedMaterialsComponent } from './recommended-materials.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecommendedMaterialsComponent', () => {
  let component: RecommendedMaterialsComponent;
  let fixture: ComponentFixture<RecommendedMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedMaterialsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onHorizontalScroll', () => {
    it('should adjust scrollLeft based on deltaY when deltaY is not 0', () => {
      const mockContainer = { scrollLeft: 0 };
      const mockEvent = {
        deltaY: 100,
        currentTarget: mockContainer,
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;

      component.onHorizontalScroll(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockContainer.scrollLeft).toBe(40); // 100 * 0.4
    });

    it('should not modify scrollLeft when deltaY is 0', () => {
      const mockContainer = { scrollLeft: 0 };
      const mockEvent = {
        deltaY: 0,
        currentTarget: mockContainer,
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;

      component.onHorizontalScroll(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockContainer.scrollLeft).toBe(0);
    });
  });
});
