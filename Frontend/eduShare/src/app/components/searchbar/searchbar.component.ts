import { Component, OnInit } from '@angular/core';
import { concatWith, map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { SearchDto } from '../../dtos/search-dto';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';

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

  constructor(private subjectService: SubjectService, private fb: FormBuilder, private profilService: ProfileService, private router: Router, private materialService: MaterialService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: [""],
      semester: ["0"],
      uploader: [""],
      title: [""]
    })

    const savedState = this.materialService.searchDto

    if (savedState) {
      this.form.patchValue({
        title: savedState.name,
        semester: savedState.semester,
        uploader: savedState.uploaderId,
        subject: savedState.subjectId
      })
    }

    if (savedState.semester === 0 || savedState.semester === null) {
      this.form.patchValue({
        semester: "0"
      })
    }

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
      const searchDto = new SearchDto(title, semester === "0" ? null : Number(semester), subject, uploader)

      this.materialService.searchDto = searchDto

      this.materialService.searchMaterials().subscribe({
        next: () => {
          this.router.navigate(["/material-search"])
        },
        error: (err) => console.error("Hiba a keresésnél:", err)
      });
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
