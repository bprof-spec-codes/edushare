import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { SearchDto } from '../../dtos/search-dto';

@Component({
  selector: 'app-searchbar',
  standalone: false,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.sass'
})
export class SearchbarComponent implements OnInit{
  subjects$ = new Observable<Subject[]>()
  semesters$ = new Observable<number[]>()
  uploaders$ = new Observable<Profile[]>()
  form!: FormGroup

  constructor(private subjectService: SubjectService, private fb: FormBuilder, private profilService: ProfileService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: [""],
      semester: ["0"],
      uploader: [""],
      title: [""]
    })

    this.subjects$ = this.subjectService.getAllSubjects().pipe(
      map(subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)))
    );

    const semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
    this.semesters$ = of(semesters)

    this.uploaders$ = this.profilService.loadAll().pipe(
      map(uploader => uploader.slice().sort((a, b) => a.fullName.localeCompare(b.fullName)))
    )
  }

  search() {
    if (this.form.valid) {
      const {title, subject, semester, uploader} = this.form.value
      const searchDto = new SearchDto(title, semester, subject, uploader)

      console.log(searchDto)
    }
  }

  isDefaultForm(): boolean {
    const value = this.form.value
    return (
      value.subject === "" &&
      value.semester === "0" &&
      value.uploader === "" &&
      value.title === ""
    )
  }
}
