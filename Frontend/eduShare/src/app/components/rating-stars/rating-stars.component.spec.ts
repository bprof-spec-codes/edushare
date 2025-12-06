import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingStarsComponent } from './rating-stars.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RatingStarsComponent', () => {
  let component: RatingStarsComponent;
  let fixture: ComponentFixture<RatingStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingStarsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('roundedToHalf', () => {
    it('should return 0 when rating is null', () => {
      component.rating = null;
      expect(component.roundedToHalf).toBe(0);
    });

    it('should round to nearest half', () => {
      component.rating = 3.3;
      expect(component.roundedToHalf).toBe(3.5);

      component.rating = 3.7;
      expect(component.roundedToHalf).toBe(3.5);

      component.rating = 3.8;
      expect(component.roundedToHalf).toBe(4.0);
    });
  });

  describe('fullStars', () => {
    it('should return floor of rounded rating', () => {
      component.rating = 3.5;
      expect(component.fullStars).toBe(3);

      component.rating = 4.0;
      expect(component.fullStars).toBe(4);
    });
  });

  describe('hasHalfStar', () => {
    it('should return true when rating rounds to half', () => {
      component.rating = 3.5;
      expect(component.hasHalfStar).toBe(true);
    });

    it('should return false when rating is whole number', () => {
      component.rating = 3.0;
      expect(component.hasHalfStar).toBe(false);
    });
  });

  describe('emptyStars', () => {
    it('should calculate remaining empty stars', () => {
      component.rating = 3.5;
      expect(component.emptyStars).toBe(1);

      component.rating = 3.0;
      expect(component.emptyStars).toBe(2);
    });
  });

  describe('ariaLabel', () => {
    it('should format aria label with rating value', () => {
      component.rating = 4.2;
      expect(component.ariaLabel).toBe('Rating: 5/4.2');
    });

    it('should format with 0.0 when rating is null', () => {
      component.rating = null;
      expect(component.ariaLabel).toBe('Rating: 5/0.0');
    });
  });
});
