import { Component, Input, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Observable } from 'rxjs';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-material-search-list',
  standalone: false,
  templateUrl: './material-search-list.component.html',
  styleUrl: './material-search-list.component.sass'
})
export class MaterialSearchListComponent implements OnInit{
  materials: MaterialShortViewDto[] = []
  @Input() search: string = ""

  trackById = (_: number, m: MaterialShortViewDto) => m.id;
  
  constructor (private materialService: MaterialService) { }

  ngOnInit(): void {
    this.materialService.materialsShort$.subscribe(res => {
      this.materials = res
    })
  }

  searchNotNull(): boolean {
    return this.search !== ""
  }
}
