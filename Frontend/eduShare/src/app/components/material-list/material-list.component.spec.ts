import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialListComponent } from './material-list.component';
import { MaterialService } from '../../services/material.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { of, throwError } from 'rxjs';

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;
  let mockMaterialService: jasmine.SpyObj<MaterialService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockMaterialService = jasmine.createSpyObj('MaterialService', ['loadAll']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockMaterialService.loadAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [MaterialListComponent],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialListComponent);
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

  describe('loadMaterials', () => {
    it('should set error message on load failure', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('Load failed');
      mockMaterialService.loadAll.and.returnValue(throwError(() => error));

      component.loadMaterials();

      expect(component.error).toBe('Nem sikerült betölteni az anyagokat.');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('openDetail', () => {
    it('should navigate to material detail view', () => {
      const material = { id: 'mat-123' } as MaterialShortViewDto;

      component.openDetail(material);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/materials/mat-123/view']);
    });
  });
});
