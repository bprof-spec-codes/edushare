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
  showSearch = false

  constructor(private route: ActivatedRoute) { }

  get isMobile(): boolean {
    return window.innerWidth <= 768
  }

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

    if (!this.isMobile) {
      this.showSearch = true
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch
  }

  searchSubject(subjectId: string, title: string) {
    this.subjectId = subjectId;
    this.search = title;
    this.isInSearch = true;
  }
}
