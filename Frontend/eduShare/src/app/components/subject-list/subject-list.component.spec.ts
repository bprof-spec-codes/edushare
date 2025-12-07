// subject-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectListComponent } from './subject-list.component';
import { SubjectService } from '../../services/subject.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from '../../models/subject';
import { SubjectCreateDto } from '../../dtos/subject-create-dto';

class SubjectServiceMock {
  private _subjects$ = new BehaviorSubject<Subject[]>([])
  subjects$ = this._subjects$.asObservable()

  getAllSubjects = jasmine.createSpy('getAllSubjects').and.callFake(() => {
    this._subjects$.next([
      { id: '1', name: 'Analízis', semester: 3 },
      { id: '2', name: 'Fizika', semester: 2 },
    ]);
    return of(void 0)
  })

  createSubject = jasmine.createSpy('createSubject').and.callFake((dto: SubjectCreateDto) => {
    const current = this._subjects$.value
    const created: Subject = {
      id: (current.length + 1).toString(),
      name: dto.name,
      semester: dto.semester ?? 1,
    }
    this._subjects$.next([...current, created])
    return of(created)
  })

  updateSubject = jasmine.createSpy('updateSubject').and.callFake((dto: SubjectCreateDto, id: string) => {
    const updated = this._subjects$.value.map(s => s.id === id ? { ...s, ...dto } as Subject : s)
    this._subjects$.next(updated)
    return of(void 0)
  })

  deleteSubject = jasmine.createSpy('deleteSubject').and.callFake((id: string) => {
    const filtered = this._subjects$.value.filter(s => s.id !== id)
    this._subjects$.next(filtered)
    return of(void 0)
  })
}

describe('SubjectListComponent', () => {
  let component: SubjectListComponent
  let fixture: ComponentFixture<SubjectListComponent>
  let service: SubjectServiceMock

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectListComponent],
      providers: [{ provide: SubjectService, useClass: SubjectServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(SubjectListComponent)
    component = fixture.componentInstance
    service = TestBed.inject(SubjectService) as unknown as SubjectServiceMock
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('ngOnInit should call refresh and wire up subjects$', (done) => {
    spyOn(component, 'refresh').and.callThrough()

    fixture.detectChanges()

    expect(component.refresh).toHaveBeenCalled()
    component.subjects$.subscribe(list => {
      expect(Array.isArray(list)).toBeTrue()
      expect(list.length).toBe(2)
      expect(list[0].name).toBe('Analízis')
      done()
    })
  })

  it('refresh should clear error on success', () => {
    component.error = 'prev error'

    component.refresh()

    expect(component.error).toBeNull()
  })

  it('refresh should set error on failure and stop loading', () => {
    (service.getAllSubjects as jasmine.Spy).and.returnValue(throwError(() => new Error('boom')))

    component.loading = false
    component.error = null

    component.refresh()

    expect(component.loading).toBeFalse()
    expect(component.error).toContain('Error getting subjects')
  })

  it('trackById should return entity id', () => {
    const s: Subject = { id: '42', name: 'Prog', semester: 1 }
    expect(component.trackById(0, s)).toBe('42')
  })

  it('startEdit/cancelEdit should set/reset editingId', () => {
    const s: Subject = { id: '1', name: 'Analízis', semester: 3 }
    component.startEdit(s)
    expect(component.editingId).toBe('1')

    component.cancelEdit()
    expect(component.editingId).toBeNull()
  })

  it('handleEdit should clear savingId and editingId on success', () => {
    const dto: SubjectCreateDto = { name: 'Matek', semester: 2 }
    component.savingId = null
    component.editingId = '1'

    component.handleEdit(dto, '1')

    expect(component.savingId).toBeNull()
    expect(component.editingId).toBeNull()
  })

  it('handleEdit should set error and clear savingId on error', () => {
    (service.updateSubject as jasmine.Spy).and.returnValue(throwError(() => new Error('upd fail')))
    const dto: SubjectCreateDto = { name: 'Matek', semester: 2 }

    component.savingId = null
    component.editingId = '1'

    component.handleEdit(dto, '1')

    expect(component.savingId).toBeNull()
    expect(component.error).toBe('Could not update subject.')
    expect(component.editingId).toBe('1')
  })

  it('openCreate/closeCreate should toggle dialog and clear createError on open', () => {
    component.createError = 'x'
    component.createOpen = false

    component.openCreate()
    expect(component.createOpen).toBeTrue()
    expect(component.createError).toBeNull()

    component.closeCreate()
    expect(component.createOpen).toBeFalse()
  })

  it('handleCreate should close dialog and clear error on success', () => {
    const dto: SubjectCreateDto = { name: 'Stat', semester: 4 }

    component.creating = false
    component.createOpen = true
    component.createError = 'old'

    component.handleCreate(dto)

    expect(component.creating).toBeFalse()
    expect(component.createOpen).toBeFalse()
    expect(component.createError).toBeNull()
  })

  it('handleCreate should set error and stop creating on failure', () => {
    (service.createSubject as jasmine.Spy).and.returnValue(throwError(() => new Error('create fail')))

    const dto: SubjectCreateDto = { name: 'Stat', semester: 4 }
    component.creating = false
    component.createOpen = true
    component.createError = null

    component.handleCreate(dto)

    expect(component.creating).toBeFalse()
    expect(component.createOpen).toBeTrue()
    expect(component.createError!).toBe('Could not create subject.')
  })

  it('deleteSubject should set error on failure', () => {
    (service.deleteSubject as jasmine.Spy).and.returnValue(throwError(() => new Error('del fail')))

    component.error = null
    component.deleteSubject('2')

    expect(component.error!).toBe('Could not delete subject.')
  })
})
