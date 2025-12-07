import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingCardComponent } from './rating-card.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RatingViewDto } from '../../dtos/rating-view-dto';

describe('RatingCardComponent', () => {
  let component: RatingCardComponent;
  let fixture: ComponentFixture<RatingCardComponent>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['loadAll'], {
      profilessShort$: of([])
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    profileServiceSpy.loadAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [RatingCardComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingCardComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.rating = {
      id: '1',
      userId: 'user1',
      userName: 'Test User',
      rate: 5,
      comment: 'Test comment',
      uploadDate: new Date()
    } as RatingViewDto;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should transform userList$ into ratingUserMap$ with user id as key', (done) => {
      const mockUsers = [
        { id: 'user1', fullName: 'User One', email: 'user1@test.com', image: { id: '', fileName: '', file: '' } },
        { id: 'user2', fullName: 'User Two', email: 'user2@test.com', image: { id: '', fileName: '', file: '' } }
      ];
      (Object.getOwnPropertyDescriptor(profileService, 'profilessShort$')!.get as jasmine.Spy).and.returnValue(of(mockUsers));

      component.ngOnInit();

      component.ratingUserMap$.subscribe(map => {
        expect(map['user1'].id).toBe('user1');
        expect(map['user2'].id).toBe('user2');
        expect(Object.keys(map).length).toBe(2);
        done();
      });
    });
  });

  describe('isLongComment', () => {
    it('should check if comment exceeds maxCommentLength', () => {
      component.maxCommentLength = 51;
      
      component.rating.comment = 'a'.repeat(52);
      expect(component.isLongComment).toBe(true);

      component.rating.comment = 'a'.repeat(50);
      expect(component.isLongComment).toBe(false);

      component.rating.comment = null as any;
      expect(component.isLongComment).toBe(false);
    });
  });

  describe('onShowMore', () => {
    it('should emit showFullComment event', () => {
      spyOn(component.showFullComment, 'emit');

      component.onShowMore();

      expect(component.showFullComment.emit).toHaveBeenCalled();
    });
  });

  describe('formatRatingDate', () => {
    it('should return empty string when value is null or empty', () => {
      expect(component.formatRatingDate('')).toBe('');
      expect(component.formatRatingDate(null as any)).toBe('');
    });

    it('should return time format when date is under 24 hours', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 10 * 60 * 60 * 1000); // 10 hours ago

      const result = component.formatRatingDate(recentDate);

      expect(result).toContain(':');
      expect(result).not.toContain('<div');
    });

    it('should return formatted date when date is over 24 hours', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

      const result = component.formatRatingDate(oldDate);

      expect(result).toContain('<div');
      expect(result).toContain(oldDate.getFullYear().toString());
    });

    it('should format date with correct structure', () => {
      const testDate = new Date('2024-03-15T10:30:00');
      const now = new Date();
      const isUnder24h = (now.getTime() - testDate.getTime()) < 24 * 60 * 60 * 1000;

      if (!isUnder24h) {
        const result = component.formatRatingDate(testDate);

        expect(result).toContain('2024.');
        expect(result).toContain('03.15.');
      } else {
        // If somehow test runs and date is under 24h, just check it returns something
        const result = component.formatRatingDate(testDate);
        expect(result).toBeTruthy();
      }
    });

    it('should pad month and day with leading zeros', () => {
      const testDate = new Date('2024-01-05T10:30:00');
      const now = new Date();
      const isUnder24h = (now.getTime() - testDate.getTime()) < 24 * 60 * 60 * 1000;

      if (!isUnder24h) {
        const result = component.formatRatingDate(testDate);

        expect(result).toContain('01.05.');
      } else {
        // If somehow test runs and date is under 24h, just verify output exists
        const result = component.formatRatingDate(testDate);
        expect(result).toBeTruthy();
      }
    });
  });

  describe('openProfile', () => {
    it('should navigate to profile-view with userId', () => {
      const userId = 'user123';

      component.openProfile(userId);

      expect(router.navigate).toHaveBeenCalledWith(['/profile-view', userId]);
    });
  });

  describe('deleterRating', () => {
    it('should be defined', () => {
      expect(component.deleterRating).toBeDefined();
    });
  });
});
