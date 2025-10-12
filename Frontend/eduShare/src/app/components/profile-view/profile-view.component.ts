import { Component } from '@angular/core';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialViewForProfileDto } from '../../dtos/material-view-for-profile-dto';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.sass'
})
export class ProfileViewComponent {
  profile:ProfileViewDto|null=null
  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router) {}
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id')
      if(!id) {
        alert('Érvénytelen azonosító.')
        return
      }

      if (id) {
      this.profileService.getById(id).subscribe({
        next: (data) => {
          this.profile = data
          console.log(this.profile)
        },
        error: (err) => {
          console.error(err)
          alert('Nem sikerült betölteni a profilt.')
        }
      })
    }
  }
  openDetail(material: MaterialViewForProfileDto): void {
        this.router.navigate(['/material-view', material.id])
      }

  editDetail(profile: ProfileViewDto): void {
       this.router.navigate(['/profile-update', profile.id])
  }
      
  getProfileImageSrc(): string {
  const file = this.profile?.image?.file;
  if (!file) return 'assets/default-avatar.png'; // alapértelmezett kép
  return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
  }
}
