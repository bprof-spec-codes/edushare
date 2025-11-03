import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { SubjectCreateDto } from '../../dtos/subject-create-dto';

@Component({
  selector: 'app-subject-list',
  standalone: false,
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.sass'
})
export class SubjectListComponent implements OnInit {
  loading = false
  error: string | null = null

  createOpen = false
  creating = false
  createError: string | null = null

  editingId: number | string | null = null
  savingId: number | string | null = null
  deletingId: number | string | null = null

  public subjects$: Observable<Subject[]> = new Observable<Subject[]>

  constructor(private subjectService: SubjectService) {
  }

  ngOnInit(): void {
    this.refresh()
    this.subjects$ = this.subjectService.subjects$
  }

  trackById = (_: number, s: Subject) => s.id;

  refresh(): void {
    this.loading = true
    this.error = null
    this.subjectService.getAllSubjects().subscribe({
      next: () => this.loading = false,
      error: (err) => { this.loading = false, this.error = 'Error getting subjects ', console.error(err) }
    })
  }

  startEdit(s: Subject) {
    this.editingId = s.id
  }

  cancelEdit() {
    this.editingId = null
  }

  handleEdit(subject: SubjectCreateDto, id: string) {
    this.savingId = id

    this.subjectService.updateSubject(subject, id).subscribe({
      next: () => {
        this.savingId = null
        this.editingId = null
      },
      error: (err) => {
        console.error(err)
        this.error = "Could not update subject."
        this.savingId = null
      },
    })
}

openCreate() {
  this.createError = null
  this.createOpen = true
}

closeCreate() {
  this.createOpen = false
}

handleCreate(dto: SubjectCreateDto) {
  this.creating = true
  this.createError = null

  this.subjectService.createSubject(dto).subscribe({
    next: () => {
      this.creating = false
      this.createOpen = false
    },
    error: (err) => {
      console.error(err)
      this.createError = "Could not create subject."
      this.creating = false
    },
  })
}

deleteSubject(id: string) {
  this.subjectService.deleteSubject(id).subscribe({
    next: () => {
    },
    error: (err) => {
      console.error(err)
      this.error = "Could not delete subject."
    },
  })
}
}
