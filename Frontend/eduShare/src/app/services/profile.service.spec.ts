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
  });

  describe('Additional Profile Functions', () => {
    it('should get profile by id', (done) => {
      service.getById('user-1').subscribe(profile => {
        expect(profile).toEqual(mockProfile);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/user-1`);
      req.flush(mockProfile);
    });

    it('should grant admin role', (done) => {
      service.grantAdmin('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/GrantAdmin/user-1`);
      req.flush({});
    });

    it('should grant teacher role', (done) => {
      service.grantTeacher('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/GrantTeacher/user-1`);
      req.flush({});
    });

    it('should revoke role', (done) => {
      service.revokeRole('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/RevokeRole/user-1`);
      req.flush({});
    });

    it('should warn user', (done) => {
      service.warnUser('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/Warn/user-1`);
      req.flush({});
    });

    it('should remove warning', (done) => {
      service.removeWarning('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/RemoveWarning/user-1`);
      req.flush({});
    });

    it('should ban user', (done) => {
      service.banUser('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/Ban/user-1`);
      req.flush({});
    });

    it('should unban user', (done) => {
      service.unbanUser('user-1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/Unban/user-1`);
      req.flush({});
    });
  });
});
