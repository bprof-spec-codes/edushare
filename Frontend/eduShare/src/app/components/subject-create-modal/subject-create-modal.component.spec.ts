import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectCreateModalComponent } from './subject-create-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';

describe('SubjectCreateModalComponent', () => {
  let component: SubjectCreateModalComponent
  let fixture: ComponentFixture<SubjectCreateModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectCreateModalComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(SubjectCreateModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form with controls', () => {
    expect(component.createForm).toBeTruthy()
    const controls = component.createForm.controls
    expect(controls['name']).toBeTruthy()
    expect(controls['semester']).toBeTruthy()
  })

  it('should require name', () => {
    const name = component.createForm.get('name')!
    name.setValue('')
    expect(name.valid).toBeFalse()
    expect(component.createForm.valid).toBeFalse()

    name.setValue('Algebra')
    expect(name.valid).toBeTrue()
  })

  it('should validate semester min/max (1..20)', () => {
    const sem = component.createForm.get('semester')!

    sem.setValue(0)
    expect(sem.valid).toBeFalse()

    sem.setValue(21)
    expect(sem.valid).toBeFalse()

    sem.setValue(1)
    expect(sem.valid).toBeTrue()

    sem.setValue(20)
    expect(sem.valid).toBeTrue()
  })

  it('submit() should emit save with capitalized name when form is valid', () => {
    spyOn(component.save, 'emit')

    component.createForm.setValue({ name: 'analízis', semester: 3 })
    expect(component.createForm.valid).toBeTrue()

    component.submit()

    expect(component.save.emit).toHaveBeenCalledOnceWith({
      name: 'Analízis',
      semester: 3,
    })
  })

  it('submit() should NOT emit when form is invalid', () => {
    spyOn(component.save, 'emit')
    component.createForm.setValue({ name: '', semester: 3 })
    expect(component.createForm.valid).toBeFalse()

    component.submit()
    expect(component.save.emit).not.toHaveBeenCalled()
  })

  it('onCancel() should emit close', () => {
    spyOn(component.close, 'emit')
    component.onCancel()
    expect(component.close.emit).toHaveBeenCalled()
  })

  it('should reset form when `open` changes to true (ngOnChanges)', () => {
    component.createForm.setValue({ name: 'Valami', semester: 7 })
    component.open = true
    component.ngOnChanges({
      open: new SimpleChange(false, true, false),
    })

    const v = component.createForm.getRawValue()
    expect(v.name).toBe('')
    expect(v.semester).toBe(1)
  })

  it('should not throw if ngOnChanges runs before form is built', () => {
    const fresh = new SubjectCreateModalComponent(TestBed.inject(ReactiveFormsModule) as any)
    expect(() => {
      fresh.open = true
      fresh.ngOnChanges({ open: new SimpleChange(false, true, true) })
    }).not.toThrow()
  })
})
