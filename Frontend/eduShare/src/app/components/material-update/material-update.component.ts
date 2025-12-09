import { Component, OnInit } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Material } from '../../models/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { MaterialFormValue } from '../material-form/material-form.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-material-update',
  standalone: false,
  templateUrl: './material-update.component.html',
  styleUrl: './material-update.component.sass'
})
export class MaterialUpdateComponent implements OnInit{
  material?: MaterialViewDto
  id!: string

  constructor(private route: ActivatedRoute, private materialService: MaterialService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!
    this.materialService.getById(this.id).subscribe({
      next: (data) =>{
        this.material=data
      },
      error: (err) => {
        console.error("The materials could not be loaded.", err)
        this.router.navigate(['/materials'])
      }
    })
  }

  onUpdate(value: MaterialFormValue){
    
    if (!this.material) return
    const dto = {
      title: value.title,
      subjectId: value.subjectId,
      description: value.description,
      content: value.content ? value.content : this.material.content
    }
    
    this.materialService.update(this.id, dto).subscribe({
      next: () => {
        //console.log("Modification successful!")
        this.router.navigate(['/materials', this.id, 'view'])
      },
      error: (err) => {
        console.error("Unable to modify the material", err)
        this.toast.show("Modification unsuccessful!")
        this.router.navigate(['/materials'])
      }
    })
  }
}
