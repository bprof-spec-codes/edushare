import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { concatWith, map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { SearchDto } from '../../dtos/search-dto';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { SearchUploaderDto } from '../../dtos/search-uploader-dto';

@Component({
  selector: 'app-searchbar',
  standalone: false,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.sass'
})
export class SearchbarComponent implements OnInit{
  @Output() isInSearch = new EventEmitter<boolean>
  @Output() searchValue = new EventEmitter<string>
  
  subjects$ = new Observable<Subject[]>()
  semesters$ = new Observable<number[]>()
  uploaders$ = new Observable<SearchUploaderDto[]>()
  form!: FormGroup

  constructor(private subjectService: SubjectService, private fb: FormBuilder, private profilService: ProfileService, private router: Router, private materialService: MaterialService) { }

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

    this.uploaders$ = this.profilService.loadUploaders().pipe(
      map(uploader => uploader.slice().sort((a, b) => a.fullName.localeCompare(b.fullName)))
    )
  }

  search() {
    if (this.form.valid) {
      if (this.isDefaultForm()) {
        this.isInSearch.emit(false)
        return
      }
      const {title, subject, semester, uploader} = this.form.value
      const searchDto = new SearchDto(title, semester === "0" ? null : Number(semester), subject, uploader)

      this.materialService.searchMaterials(searchDto).subscribe({
        next: () => {
          this.isInSearch.emit(true)
          this.searchValue.emit(title)
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

  resetSearch() {
    this.form.patchValue({
      subject: "",
      semester: "0",
      uploader: "",
      title: ""
    })
  }
}
