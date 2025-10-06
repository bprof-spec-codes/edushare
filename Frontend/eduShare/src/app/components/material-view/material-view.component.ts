import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-view',
  standalone: false,
  templateUrl: './material-view.component.html',
  styleUrl: './material-view.component.sass'
})
export class MaterialViewComponent implements OnInit {
  constructor(private route: ActivatedRoute, private materialService: MaterialService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.materialService.getById(id).subscribe(material => {
        console.log(material)
      })
    }
  }
}
