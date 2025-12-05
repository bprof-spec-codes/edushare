import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomepageComponent } from './homepage.component';
import { AuthService } from '../../services/authentication.service';
import { StatisticsService } from '../../services/statistics.service';
import { HomepageStatisticsDto } from '../../dtos/homepage-statistics-dto';
import { UserStatisticsDto } from '../../dtos/user-statistics-dto';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let statsServiceMock: jasmine.SpyObj<StatisticsService>;
  let router: Router;

  const mockHomepageStats: HomepageStatisticsDto = {
    materialCount: 10,
    userCount: 5,
    subjectCount: 3,
    downloadCount: 42,
    lastMaterials: [
      {
        id: '1',
        title: 'Sample material',
        isRecommended: true,
        isExam: false,
        averageRating: 4.5,
        ratingCount: 10,
        subject: {
          id: 's1',
          name: 'Algorithms',
          semester: 3
        },
        uploader: {
          id: 'u1',
          fullName: 'John Doe',
          image: {
            id: 'img1',
            fileName: 'avatar.png',
            file: ''
          }
        },
        uploadDate: new Date().toISOString(),
        downloadCount: 7
      }
    ]
  };

  const mockUserStats: UserStatisticsDto = {
    materialsSaved: 3,
    materialsUploaded: 5,
    ratingsGiven: 4,
    userAvgRating: 4.2
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'isLoggedIn',
      'getUserId'
    ]);

    statsServiceMock = jasmine.createSpyObj<StatisticsService>('StatisticsService', [
      'getHomepageStatistics',
      'getUserStatistics'
    ]);

    // Default behavior for tests where user is logged in
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.getUserId.and.returnValue('user-123');

    statsServiceMock.getHomepageStatistics.and.returnValue(of(mockHomepageStats));
    statsServiceMock.getUserStatistics.and.returnValue(of(mockUserStats));

    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: StatisticsService, useValue: statsServiceMock }
      ],
      // Ignore unknown elements/attributes in template (ngx-typed-js, routerLink etc.)
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;

    // This will call ngOnInit()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn and userId from AuthService on init', () => {
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(authServiceMock.getUserId).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.userId).toBe('user-123');
  });

  it('should load homepage statistics on init', () => {
    expect(statsServiceMock.getHomepageStatistics).toHaveBeenCalled();
    expect(component.stats).toEqual(mockHomepageStats);
  });

  it('should load user statistics when userId is available on init', () => {
    expect(statsServiceMock.getUserStatistics).toHaveBeenCalledWith('user-123');
    expect(component.userStats).toEqual(mockUserStats);
  });

  it('should not load user statistics when userId is empty', () => {
    // Arrange: change authService to return empty userId
    statsServiceMock.getUserStatistics.calls.reset();
    authServiceMock.getUserId.and.returnValue('');

    const localFixture = TestBed.createComponent(HomepageComponent);
    const localComponent = localFixture.componentInstance;

    // This triggers ngOnInit for the new component instance
    localFixture.detectChanges();

    expect(localComponent.userId).toBe('');
    expect(statsServiceMock.getUserStatistics).not.toHaveBeenCalled();
  });

  it('should navigate to /materials when showMaterials is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.showMaterials();
    expect(navigateSpy).toHaveBeenCalledWith(['/materials']);
  });

  it('should have predefined typed strings', () => {
    expect(component.typedStrings.length).toBeGreaterThan(0);
    expect(component.typedStrings).toContain('share your notes.');
  });

  it('should have countup options with scroll spy enabled', () => {
    expect(component.countupOptions.enableScrollSpy).toBeTrue();
    expect(component.countupOptions.duration).toBe(2);
  });

  it('should have decimal countup options with decimalPlaces set', () => {
    expect(component.countupOptionsWithDecimal.enableScrollSpy).toBeTrue();
    expect(component.countupOptionsWithDecimal.duration).toBe(2);
    expect(component.countupOptionsWithDecimal.decimalPlaces).toBe(1);
  });
});
