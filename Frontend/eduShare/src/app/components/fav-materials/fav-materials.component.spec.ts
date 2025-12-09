import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavMaterialsComponent } from './fav-materials.component';
import { FavMaterialService } from '../../services/fav-material.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

describe('FavMaterialsComponent', () => {
  let component: FavMaterialsComponent;
  let fixture: ComponentFixture<FavMaterialsComponent>;
  let mockFavMaterialService: any;
  let favMaterialsSubject: BehaviorSubject<MaterialShortViewDto[]>;

  beforeEach(async () => {
    favMaterialsSubject = new BehaviorSubject<MaterialShortViewDto[]>([]);
    mockFavMaterialService = jasmine.createSpyObj('FavMaterialService', ['getAll']);
    mockFavMaterialService.favMaterials$ = favMaterialsSubject.asObservable();

    await TestBed.configureTestingModule({
      declarations: [FavMaterialsComponent],
      providers: [
        { provide: FavMaterialService, useValue: mockFavMaterialService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavMaterialsComponent);
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

    it('should work with different materials', () => {
      const material1 = { id: 'mat-abc' } as MaterialShortViewDto;
      const material2 = { id: 'mat-xyz' } as MaterialShortViewDto;

      expect(component.trackById(0, material1)).toBe('mat-abc');
      expect(component.trackById(1, material2)).toBe('mat-xyz');
    });
  });

  describe('ngOnInit', () => {
    it('should assign favMaterials$ observable on successful getAll', () => {
      mockFavMaterialService.getAll.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.favMaterials$).toBe(mockFavMaterialService.favMaterials$);
    });

    it('should handle error from getAll without crashing', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('Failed to load');
      mockFavMaterialService.getAll.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
