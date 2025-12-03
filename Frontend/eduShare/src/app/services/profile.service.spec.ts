import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { ProfileViewDto } from '../dtos/profile-view-dto';
import { ProfilListViewDto } from '../dtos/profil-list-view-dto';
import { SearchUploaderDto } from '../dtos/search-uploader-dto';
import { UpdateProfileDto } from '../dtos/update-profile-dto';
import { environment } from '../../environments/environment';

describe('ProfileService Logic Tests', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = `${environment.baseApiUrl}/api/User`;

  const mockProfile: ProfileViewDto = {
    id: 'user-1',
    fullName: 'Test User',
    email: 'test@example.com'
  } as ProfileViewDto;

  const mockProfileList: ProfilListViewDto = {
    id: 'user-1',
    fullName: 'Test User'
  } as ProfilListViewDto;

  const mockUploader: SearchUploaderDto = {
    id: 'user-1',
    fullName: 'Test User'
  } as SearchUploaderDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('State Management Logic', () => {
    it('should initialize with empty profiles', (done) => {
      service.profilessShort$.subscribe(profiles => {
        expect(profiles).toEqual([]);
        done();
      });
    });

    it('should initialize with empty uploaders', (done) => {
      service.uploaders$.subscribe(uploaders => {
        expect(uploaders).toEqual([]);
        done();
      });
    });

    it('should initialize with default current profile', (done) => {
      service.currentProfile$.subscribe(profile => {
        expect(profile).toBeInstanceOf(ProfileViewDto);
        done();
      });
    });

    it('should update profiles state after loadAll', (done) => {
      const mockProfiles = [mockProfileList];

      service.loadAll().subscribe(() => {
        service.profilessShort$.subscribe(profiles => {
          expect(profiles).toEqual(mockProfiles);
          done();
        });
      });

      const req = httpMock.expectOne(apiBaseUrl);
      req.flush(mockProfiles);
    });

    it('should update uploaders state after loadUploaders', (done) => {
      const mockUploaders = [mockUploader];

      service.loadUploaders().subscribe(() => {
        service.uploaders$.subscribe(uploaders => {
          expect(uploaders).toEqual(mockUploaders);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/GetUploaders`);
      req.flush(mockUploaders);
    });

    it('should update current profile state after getCurrentProfile', (done) => {
      service.getCurrentProfile('user-1').subscribe(() => {
        service.currentProfile$.subscribe(profile => {
          expect(profile).toEqual(mockProfile);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      req.flush(mockProfile);
    });
  });

  describe('Profile Update Logic', () => {
    it('should refresh current profile after update', (done) => {
      const updateDto: UpdateProfileDto = {
        email: 'test@example.com',
        firstname: 'Updated',
        lastname: 'Name',
        image: { id: '', fileName: '', file: '' }
      };
      const updatedProfile = { ...mockProfile, fullName: 'Updated Name' };

      let callCount = 0;
      service.currentProfile$.subscribe(profile => {
        callCount++;
        if (callCount === 2) {
          expect(profile).toEqual(updatedProfile);
          done();
        }
      });

      service.update('user-1', updateDto).subscribe();

      const updateReq = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      updateReq.flush(null);

      const getReq = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      getReq.flush(updatedProfile);
    });

    it('should trigger getCurrentProfile after update', (done) => {
      const updateDto: UpdateProfileDto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        image: { id: '', fileName: '', file: '' }
      };

      service.update('user-1', updateDto).subscribe(() => {
        done();
      });

      const updateReq = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      updateReq.flush(null);

      const getReq = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      getReq.flush(mockProfile);
    });
  });

  describe('Multiple Profile State Logic', () => {
    it('should maintain separate state for profiles list and current profile', (done) => {
      const profiles = [mockProfileList];
      
      service.loadAll().subscribe(() => {
        service.getCurrentProfile('user-1').subscribe(() => {
          let profilesChecked = false;
          let currentProfileChecked = false;

          service.profilessShort$.subscribe(p => {
            expect(p).toEqual(profiles);
            profilesChecked = true;
            if (profilesChecked && currentProfileChecked) done();
          });

          service.currentProfile$.subscribe(cp => {
            expect(cp).toEqual(mockProfile);
            currentProfileChecked = true;
            if (profilesChecked && currentProfileChecked) done();
          });
        });

        const getReq = httpMock.expectOne(`${apiBaseUrl}/user-1`);
        getReq.flush(mockProfile);
      });

      const loadReq = httpMock.expectOne(apiBaseUrl);
      loadReq.flush(profiles);
    });
  });

  describe('Observable Return Type Logic', () => {
    it('should return Observable from getCurrentProfile', (done) => {
      const result = service.getCurrentProfile('user-1');
      
      expect(result).toBeInstanceOf(Object);
      result.subscribe(() => done());

      const req = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      req.flush(mockProfile);
    });

    it('should return Observable from loadAll', (done) => {
      const result = service.loadAll();
      
      expect(result).toBeInstanceOf(Object);
      result.subscribe(() => done());

      const req = httpMock.expectOne(apiBaseUrl);
      req.flush([]);
    });

    it('should return Observable from loadUploaders', (done) => {
      const result = service.loadUploaders();
      
      expect(result).toBeInstanceOf(Object);
      result.subscribe(() => done());

      const req = httpMock.expectOne(`${apiBaseUrl}/GetUploaders`);
      req.flush([]);
    });
  });
});
