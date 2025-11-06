import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: false,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.sass'
})
export class SearchbarComponent implements OnInit{
  subjects$ = new Observable<Subject[]>()
  semesters$ = new Observable<number[]>()
  form!: FormGroup

  constructor(private subjectService: SubjectService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: [""],
      semester: [0],
      title: [""]
    })

    this.subjects$ = this.subjectService.getAllSubjects().pipe(
      map(subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)))
    );

    const semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8]

    this.semesters$ = of(semesters)
  }
}
