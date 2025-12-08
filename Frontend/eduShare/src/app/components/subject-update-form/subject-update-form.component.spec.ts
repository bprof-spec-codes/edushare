// subject-update-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectUpdateFormComponent } from './subject-update-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

describe('SubjectUpdateFormComponent', () => {
    let component: SubjectUpdateFormComponent
    let fixture: ComponentFixture<SubjectUpdateFormComponent>

    const subjectMock = {
        id: 's1',
        name: 'Analízis',
        semester: 3,
        credit: 2
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubjectUpdateFormComponent],
            imports: [ReactiveFormsModule],
        }).compileComponents()

        fixture = TestBed.createComponent(SubjectUpdateFormComponent)
        component = fixture.componentInstance
        component.subject = { ...subjectMock }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should build form with initial subject values', () => {
        const form = component.updateForm
        expect(form).toBeTruthy()
        expect(form.get('name')?.value).toBe('Analízis')
        expect(form.get('semester')?.value).toBe(3)
        expect(form.get('credit')?.value).toBe(2)
    })

    it('should require name', () => {
        const control = component.updateForm.get('name')!
        control.setValue('')
        expect(control.valid).toBeFalse()
        expect(control.hasError('required')).toBeTrue()
    })

    it('should validate semester min/max (1..20)', () => {
        const control = component.updateForm.get('semester')!
        control.setValue(0)
        expect(control.valid).toBeFalse()
        expect(control.hasError('min')).toBeTrue()

        control.setValue(21)
        expect(control.valid).toBeFalse()
        expect(control.hasError('max')).toBeTrue()

        control.setValue(10)
        expect(control.valid).toBeTrue()
    })

    it('should validate credit min/max (0..30)', () => {
        const control = component.updateForm.get('credit')!
        control.setValue(-1)
        expect(control.valid).toBeFalse()
        expect(control.hasError('min')).toBeTrue()
        control.setValue(31)
        expect(control.valid).toBeFalse()
        expect(control.hasError('max')).toBeTrue()
        control.setValue(15)
        expect(control.valid).toBeTrue()
    })

    it('submit() should emit save with form value when valid', () => {
        spyOn(component.save, 'emit')
        component.updateForm.setValue({ name: 'Matek', semester: 2 })
        expect(component.updateForm.valid).toBeTrue()

        component.submit()

        expect(component.save.emit).toHaveBeenCalledWith({
            name: 'Matek',
            semester: 2,
            credit: 2
        })
    })

    it('submit() should NOT emit when form is invalid', () => {
        spyOn(component.save, 'emit')
        component.updateForm.get('name')?.setValue('')
        expect(component.updateForm.valid).toBeFalse()

        component.submit()

        expect(component.save.emit).not.toHaveBeenCalled()
    })

    it('onCancel() should emit cancel when not saving', () => {
        spyOn(component.cancel, 'emit')
        component.saving = false

        component.onCancel()

        expect(component.cancel.emit).toHaveBeenCalled()
    })

    it('onCancel() should NOT emit when saving', () => {
        spyOn(component.cancel, 'emit')
        component.saving = true

        component.onCancel()

        expect(component.cancel.emit).not.toHaveBeenCalled()
    })

    it('ngOnChanges should patch form when subject input changes (FIX: use changes["subject"])', () => {
        const newSubject = { id: 's2', name: 'Fizika', semester: 5, credit: 4 }
        component.subject = newSubject

        const changes = {
            subject: new SimpleChange(subjectMock, newSubject, false)
        } as any

        component.ngOnChanges(changes)

        expect(component.updateForm.get('name')?.value).toBe('Fizika')
        expect(component.updateForm.get('semester')?.value).toBe(5)
        expect(component.updateForm.get('credit')?.value).toBe(4)
    })

    it('ngOnChanges should handle null subject gracefully', () => {
        // Form still has original values from initialization
        const originalName = component.updateForm.get('name')?.value
        const originalSemester = component.updateForm.get('semester')?.value
        const originalCredit = component.updateForm.get('credit')?.value

        component.subject = null as any

        const changes = {
            subject: new SimpleChange(subjectMock, null, false)
        } as any

        component.ngOnChanges(changes)

        // Form should not be patched when subject is null (condition fails)
        expect(component.updateForm.get('name')?.value).toBe(originalName)
        expect(component.updateForm.get('semester')?.value).toBe(originalSemester)
        expect(component.updateForm.get('credit')?.value).toBe(originalCredit)
    })
})
