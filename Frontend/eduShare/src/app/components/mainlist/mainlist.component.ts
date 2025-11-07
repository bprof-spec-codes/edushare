import { Component } from '@angular/core';

@Component({
  selector: 'app-mainlist',
  standalone: false,
  templateUrl: './mainlist.component.html',
  styleUrl: './mainlist.component.sass'
})
export class MainlistComponent {
  isInSearch: boolean = false

  changeIsInSearch(isInSearch: boolean) {
    this.isInSearch = isInSearch
  }
}
