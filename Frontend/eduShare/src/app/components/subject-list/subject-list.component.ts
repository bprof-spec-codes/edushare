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
  error?: string

  createOpen = false
  creating = false
  createError: string | null = null

  public subjects$: Observable<Subject[]> = new Observable<Subject[]>

  constructor(private subjectService: SubjectService) {
  }

  ngOnInit(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: () => {
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.error = "Could not load subjects."
        this.loading = false
      },
    })
    this.subjects$ = this.subjectService.subjects$
  }

  openCreate() {
    this.createError = null
    this.createOpen = true
  }

  closeCreate() {
    this.createOpen = false
  }

  handleCreate(dto: SubjectCreateDto){
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
}
