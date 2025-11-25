import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { concatWith, map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { SearchDto } from '../../dtos/search-dto';
import { ActivatedRoute, Router } from '@angular/router';
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
  @Input() subjectId: string = ""
  
  subjects$ = new Observable<Subject[]>()
  semesters$ = new Observable<number[]>()
  uploaders$ = new Observable<SearchUploaderDto[]>()
  form!: FormGroup

  constructor(private subjectService: SubjectService, private fb: FormBuilder, private profilService: ProfileService, private router: Router, private materialService: MaterialService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: [""],
      semester: ["0"],
      uploader: [""],
      title: [""]
    });

    this.subjects$ = this.subjectService.getAllSubjects().pipe(
      map(subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)))
    );

    const semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.semesters$ = of(semesters);

    this.uploaders$ = this.profilService.loadUploaders().pipe(
      map(uploader => uploader.slice().sort((a, b) => a.fullName.localeCompare(b.fullName)))
    );

    // csak egyszer fut a patch és search
    this.route.queryParams.subscribe(params => {
      const patch: any = {
        subject: params['subject'] || "",
        semester: params['semester'] || "0",
        uploader: params['uploader'] || "",
        title: params['title'] || ""
      };
      this.form.patchValue(patch);

      // ha bármelyik param van, akkor futtatjuk a search-t
      if (params['subject'] || params['semester'] || params['uploader'] || params['title']) {
        this.search();
      }
    });
  }

  search() {
    console.log(this.form.valid)
    if (!this.form.valid) return;

    if (this.formIsDefault(this.form)) {
      this.resetSearch();
      this.isInSearch.emit(false); 
      return;
    }

    const { title, subject, semester, uploader } = this.form.value;
    const searchDto = new SearchDto(
      title,
      semester === "0" ? null : Number(semester),
      subject,
      uploader
    );

    const queryParams: any = {};
    if (title) queryParams['title'] = title;
    if (subject) queryParams['subject'] = subject;
    if (semester && semester !== "0") queryParams['semester'] = semester;
    if (uploader) queryParams['uploader'] = uploader;

    // ⚡ Itt nincs merge, csak a jelenlegi param-ek lesznek az URL-ben
    this.router.navigate([], { queryParams });

    console.log(searchDto)

    this.materialService.searchMaterials(searchDto).subscribe({
      next: () => {
        this.isInSearch.emit(true);
        this.searchValue.emit(title);
        console.log("searched")
      },
      error: (err) => console.error("Hiba a keresésnél:", err)
    });
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

    this.router.navigate([], { queryParams: {} });
  }

  formIsDefault(form: FormGroup): boolean {
    const value = form.value;
    return (
      value.subject === "" &&
      value.semester === "0" &&
      value.uploader === "" &&
      value.title === ""
    );
  }
}
