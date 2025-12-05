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
  userRoles: { [key: string]: string | null } = {};

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
        this.profiles.forEach(u => this.userRoles[u.id] = u.role)
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
          const user = this.profiles.find(u => u.id === id);
          if (user) {
            user.role = "Admin";
          }
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
          const user = this.profiles.find(u => u.id === id);
          if (user) {
            user.role = "Teacher";
          }
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
          const user = this.profiles.find(u => u.id === id);
          if (user) {
            user.role = null;
          }
        },
        error: (err) => {
          this.toast.show(err.error.message);
          console.log(err)
        }
      }
    )
  }

  changeRole(id: string)
  {
    const role = this.userRoles[id]

    if (role === "Admin") {
      this.grantAdmin(id)
    }
    else if (role === "Teacher") {
      this.grantTeacher(id)
    }
    else {
      this.revokeRole(id)
    }
  }
}
