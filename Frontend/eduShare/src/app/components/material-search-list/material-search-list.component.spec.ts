import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialSearchListComponent } from './material-search-list.component';
import { MaterialService } from '../../services/material.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { BehaviorSubject } from 'rxjs';

describe('MaterialSearchListComponent', () => {
  let component: MaterialSearchListComponent;
  let fixture: ComponentFixture<MaterialSearchListComponent>;
  let mockMaterialService: jasmine.SpyObj<MaterialService>;
  let materialsShortSubject: BehaviorSubject<MaterialShortViewDto[]>;

  beforeEach(async () => {
    materialsShortSubject = new BehaviorSubject<MaterialShortViewDto[]>([]);
    mockMaterialService = jasmine.createSpyObj('MaterialService', [], {
      materialsShort$: materialsShortSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [MaterialSearchListComponent],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialSearchListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackById', () => {
    it('should return material id', () => {
      const material = { id: 'mat-123' } as MaterialShortViewDto;

      const result = component.trackById(0, material);

      expect(result).toBe('mat-123');
    });
  });

  describe('ngOnInit', () => {
    it('should assign materials from service observable', () => {
      const materials = [
        { id: 'mat-1' } as MaterialShortViewDto,
        { id: 'mat-2' } as MaterialShortViewDto
      ];
      spyOn(console, 'log');

      materialsShortSubject.next(materials);
      component.ngOnInit();

      expect(component.materials).toEqual(materials);
    });

    it('should log materials to console', () => {
      const consoleLogSpy = spyOn(console, 'log');
      const materials = [
        { id: 'mat-1' } as MaterialShortViewDto
      ];

      materialsShortSubject.next(materials);
      component.ngOnInit();

      expect(consoleLogSpy).toHaveBeenCalledWith(materials);
    });
  });

  describe('searchNotNull', () => {
    it('should return false when search is empty string', () => {
      component.search = '';

      const result = component.searchNotNull();

      expect(result).toBe(false);
    });

    it('should return true when search has value', () => {
      component.search = 'test';

      const result = component.searchNotNull();

      expect(result).toBe(true);
    });

    it('should return true when search has whitespace', () => {
      component.search = '   ';

      const result = component.searchNotNull();

      expect(result).toBe(true);
    });
  });
});
