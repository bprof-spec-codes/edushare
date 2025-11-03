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
export class SubjectListComponent implements OnInit{
  public subjects$: Observable<Subject[]> = new Observable<Subject[]>

  constructor(private subjectService: SubjectService){
  }

  ngOnInit(): void {
    this.subjectService.getAllSubjects()
    this.subjects$=this.subjectService.subjects$
  }
}
