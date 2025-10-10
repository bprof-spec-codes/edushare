import { Component } from '@angular/core';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-list',
  standalone: false,
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.sass'
})
export class ProfileListComponent {
  profiles: ProfilListViewDto[] = []
  loading = false
  error?: string

  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.loadProfiles()
  }

  loadProfiles(): void {
    this.loading = true
    this.profileService.loadAll().subscribe({
      next: (data) => {
        this.profiles = data
        this.loading = false
      },
      error: (err:any) => {
        console.error(err)
        this.error = 'Nem sikerült betölteni a felhasználókat.'
        this.loading = false
      },
    })
  }
  // openDetail(): void {
  //     this.router.navigate(['/profile-list'])
  //   }
}
