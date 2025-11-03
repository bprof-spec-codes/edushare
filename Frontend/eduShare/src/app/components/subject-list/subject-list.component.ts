import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subject-list',
  standalone: false,
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.sass'
})
export class SubjectListComponent implements OnInit {
  loading = false
  error?: string

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
}
