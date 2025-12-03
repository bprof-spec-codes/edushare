import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainlistComponent } from './mainlist.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MainlistComponent', () => {
  let component: MainlistComponent;
  let fixture: ComponentFixture<MainlistComponent>;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject({});
    const mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [MainlistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MainlistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeIsInSearch', () => {
    it('should set isInSearch to true', () => {
      component.isInSearch = false;

      component.changeIsInSearch(true);

      expect(component.isInSearch).toBe(true);
    });

    it('should set isInSearch to false', () => {
      component.isInSearch = true;

      component.changeIsInSearch(false);

      expect(component.isInSearch).toBe(false);
    });
  });

  describe('searchValue', () => {
    it('should update search property', () => {
      component.searchValue('test query');

      expect(component.search).toBe('test query');
    });

    it('should handle empty string', () => {
      component.search = 'previous';

      component.searchValue('');

      expect(component.search).toBe('');
    });
  });

  describe('searchSubject', () => {
    it('should set subjectId, search, and isInSearch', () => {
      component.searchSubject('subj-123', 'Math homework');

      expect(component.subjectId).toBe('subj-123');
      expect(component.search).toBe('Math homework');
      expect(component.isInSearch).toBe(true);
    });

    it('should handle empty values', () => {
      component.searchSubject('', '');

      expect(component.subjectId).toBe('');
      expect(component.search).toBe('');
      expect(component.isInSearch).toBe(true);
    });
  });

  describe('ngOnInit - Query Parameter Handling', () => {
    it('should trigger search when subject param exists', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ subject: 'math-101' });

      expect(component.searchSubject).toHaveBeenCalledWith('math-101', '');
    });

    it('should trigger search when semester is not 0', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ semester: '3' });

      expect(component.searchSubject).toHaveBeenCalledWith('', '');
    });

    it('should trigger search when uploader param exists', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ uploader: 'user-123' });

      expect(component.searchSubject).toHaveBeenCalledWith('', '');
    });

    it('should trigger search when title param exists', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ title: 'algebra' });

      expect(component.searchSubject).toHaveBeenCalledWith('', 'algebra');
    });

    it('should not trigger search when all params are default', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({});

      expect(component.searchSubject).not.toHaveBeenCalled();
    });

    it('should not trigger search when semester is 0', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ semester: '0' });

      expect(component.searchSubject).not.toHaveBeenCalled();
    });

    it('should handle multiple params', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ 
        subject: 'physics-202', 
        title: 'mechanics',
        semester: '2',
        uploader: 'prof-smith'
      });

      expect(component.searchSubject).toHaveBeenCalledWith('physics-202', 'mechanics');
    });

    it('should use empty string defaults for missing params', () => {
      spyOn(component, 'searchSubject');

      component.ngOnInit();
      queryParamsSubject.next({ subject: 'math' });

      expect(component.searchSubject).toHaveBeenCalledWith('math', '');
    });
  });
});
