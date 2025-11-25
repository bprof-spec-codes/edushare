import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mainlist',
  standalone: false,
  templateUrl: './mainlist.component.html',
  styleUrl: './mainlist.component.sass'
})
export class MainlistComponent {
  isInSearch: boolean = false
  search: string = ""
  subjectId: string = ""

  constructor(private route: ActivatedRoute) {}

  changeIsInSearch(isInSearch: boolean) {
    this.isInSearch = isInSearch
  }

  searchValue(searchValue: string) {
    this.search = searchValue
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const subject = params['subject'] || "";
      const semester = params['semester'] || "0";
      const uploader = params['uploader'] || "";
      const title = params['title'] || "";

      if (subject || semester !== "0" || uploader || title) {
        this.searchSubject(subject, title);
      }
    });
  }

  searchSubject(subjectId: string, title: string) {
    this.subjectId = subjectId;
    this.search = title;
    this.isInSearch = true;
  }
}
