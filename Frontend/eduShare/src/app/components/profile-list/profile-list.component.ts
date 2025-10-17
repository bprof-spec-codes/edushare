import { Component } from '@angular/core';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { AuthService } from '../../services/authentication.service';

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
  roles: string[] = []

  constructor(private profileService: ProfileService, private router: Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.roles = this.authService.getRoles()
    this.loadProfiles()
    console.log(this.roles)
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
  openDetail(profile: ProfilListViewDto): void {
    this.router.navigate(['/profile-view', profile.id])
  }




}
