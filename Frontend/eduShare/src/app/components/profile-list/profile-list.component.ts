import { Component } from '@angular/core';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { AuthService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';

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

  constructor(private profileService: ProfileService, private router: Router, private authService : AuthService, private toast: ToastService) { }

  ngOnInit(): void {
    this.roles = this.authService.getRoles()
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
        this.error = 'Cannot load in users!'
        this.loading = false
      },
    })
  }

  openDetail(profileId: string): void {
    this.router.navigate(['/profile-view', profileId])
  }

  hasRoleAdmin(): boolean {
    if(this.roles.includes("Admin")){
      return true
    }

    return false
  }

  grantAdmin(id: string) {
    this.profileService.grantAdmin(id).subscribe({
        next: () => {
          this.toast.show("Admin added succesfully!");
          //console.log("Admin added")
        },
        error: (err) => {
          console.error(err)
        }
      }
    )
  }

  grantTeacher(id: string) {
    this.profileService.grantTeacher(id).subscribe({
        next: () => {
          this.toast.show("Teacher added succesfully!");
          //console.log("Teacher added")
        },
        error: (err) => {
          console.error(err)
        }
      }
    )
  }

  revokeRole(id: string) {
    this.profileService.revokeRole(id).subscribe({
        next: () => {
          this.toast.show("Roles deleted succesfully!");
          //console.log("Teacher added")
        },
        error: (err) => {
          this.toast.show(err.error.message);
          console.log(err)
        }
      }
    )
  }
}
