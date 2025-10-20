import { Component } from '@angular/core';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.sass'
})
export class ProfileViewComponent {
  profile:ProfileViewDto|null=null
  loading = false
  error?: string
  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router) {}
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id')
      if(!id) {
        alert('Invalid id.')
        return
      }

      if (id) {
      this.loading = true
      this.profileService.getById(id).subscribe({
        next: (data) => {
          this.profile = data
          console.log(this.profile)
          this.loading = false
        },
        error: (err) => {
          console.error(err)
          alert('Cannot load the profile.')
          this.loading = false
        }
      })
    }
  }
  openDetail(material: MaterialShortViewDto): void {
        this.router.navigate(['/materials', material.id, 'view']);
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
