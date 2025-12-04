import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchbarComponent } from './searchbar.component';
import { SubjectService } from '../../services/subject.service';
import { ProfileService } from '../../services/profile.service';
import { MaterialService } from '../../services/material.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let subjectService: jasmine.SpyObj<SubjectService>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let materialService: jasmine.SpyObj<MaterialService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const subjectServiceSpy = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['loadUploaders']);
    const materialServiceSpy = jasmine.createSpyObj('MaterialService', ['searchMaterials']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    subjectServiceSpy.getAllSubjects.and.returnValue(of([]));
    profileServiceSpy.loadUploaders.and.returnValue(of([]));
    materialServiceSpy.searchMaterials.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [SearchbarComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: SubjectService, useValue: subjectServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: MaterialService, useValue: materialServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    subjectService = TestBed.inject(SubjectService) as jasmine.SpyObj<SubjectService>;
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    materialService = TestBed.inject(MaterialService) as jasmine.SpyObj<MaterialService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with default values', () => {
      fixture.detectChanges();

      expect(component.form.value).toEqual({
        subject: '',
        semester: '0',
        uploader: '',
        title: ''
      });
    });

    it('should sort subjects alphabetically', (done) => {
      const mockSubjects = [
        { id: '1', name: 'Zebra' },
        { id: '2', name: 'Apple' },
        { id: '3', name: 'Banana' }
      ];
      subjectService.getAllSubjects.and.returnValue(of(mockSubjects as any));

      fixture.detectChanges();

      component.subjects$.subscribe(subjects => {
        expect(subjects[0].name).toBe('Apple');
        expect(subjects[1].name).toBe('Banana');
        expect(subjects[2].name).toBe('Zebra');
        done();
      });
    });

    it('should sort uploaders alphabetically', (done) => {
      const mockUploaders = [
        { id: '1', fullName: 'Zebra User' },
        { id: '2', fullName: 'Apple User' }
      ];
      profileService.loadUploaders.and.returnValue(of(mockUploaders as any));

      fixture.detectChanges();

      component.uploaders$.subscribe(uploaders => {
        expect(uploaders[0].fullName).toBe('Apple User');
        expect(uploaders[1].fullName).toBe('Zebra User');
        done();
      });
    });
  });

  describe('search', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return early when form is invalid', () => {
      component.form.setErrors({ invalid: true });

      component.search();

      expect(materialService.searchMaterials).not.toHaveBeenCalled();
    });

    it('should call resetSearch and emit false when form is default', () => {
      spyOn(component, 'resetSearch');
      spyOn(component.isInSearch, 'emit');

      component.search();

      expect(component.resetSearch).toHaveBeenCalled();
      expect(component.isInSearch.emit).toHaveBeenCalledWith(false);
    });

    it('should build SearchDto with null for semester when semester is "0"', () => {
      component.form.patchValue({ title: 'test', semester: '0' });

      component.search();

      const searchDto = materialService.searchMaterials.calls.mostRecent().args[0];
      expect(searchDto.semester).toBeNull();
    });

    it('should build SearchDto with number for semester when semester is not "0"', () => {
      component.form.patchValue({ title: 'test', semester: '3' });

      component.search();

      const searchDto = materialService.searchMaterials.calls.mostRecent().args[0];
      expect(searchDto.semester).toBe(3);
    });

    it('should navigate with queryParams containing only non-empty values', () => {
      component.form.patchValue({
        title: 'test title',
        subject: 'sub1',
        semester: '0',
        uploader: ''
      });

      component.search();

      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { title: 'test title', subject: 'sub1' }
      });
    });

    it('should emit isInSearch true and searchValue on success', () => {
      spyOn(component.isInSearch, 'emit');
      spyOn(component.searchValue, 'emit');
      component.form.patchValue({ title: 'search term' });

      component.search();

      expect(component.isInSearch.emit).toHaveBeenCalledWith(true);
      expect(component.searchValue.emit).toHaveBeenCalledWith('search term');
    });

    it('should log error on search failure', () => {
      spyOn(console, 'error');
      materialService.searchMaterials.and.returnValue(throwError(() => new Error('test error')));
      component.form.patchValue({ title: 'test' });

      component.search();

      expect(console.error).toHaveBeenCalledWith('Hiba a keresésnél:', jasmine.any(Error));
    });
  });

  describe('isDefaultForm', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return true when all fields are default', () => {
      expect(component.isDefaultForm()).toBe(true);
    });

    it('should return false when any field is not default', () => {
      component.form.patchValue({ title: 'test' });

      expect(component.isDefaultForm()).toBe(false);
    });
  });

  describe('resetSearch', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset form to default values', () => {
      component.form.patchValue({ title: 'test', subject: 'sub1' });

      component.resetSearch();

      expect(component.form.value).toEqual({
        subject: '',
        semester: '0',
        uploader: '',
        title: ''
      });
    });

    it('should navigate with empty queryParams', () => {
      component.resetSearch();

      expect(router.navigate).toHaveBeenCalledWith([], { queryParams: {} });
    });
  });

  describe('formIsDefault', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return true when form values are default', () => {
      expect(component.formIsDefault(component.form)).toBe(true);
    });

    it('should return false when any form value is not default', () => {
      component.form.patchValue({ semester: '3' });

      expect(component.formIsDefault(component.form)).toBe(false);
    });
  });
});
