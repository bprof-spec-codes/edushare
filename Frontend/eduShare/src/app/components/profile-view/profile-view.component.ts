import { Component } from '@angular/core';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.sass'
})
export class ProfileViewComponent {
  profile: ProfileViewDto | null = null
  loading = false
  error?: string
  ownProfile = false
  isAdmin = false

  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router, private authService: AuthService) { }
  
  ngOnInit() {
    // Check if current user is admin
    const roles = this.authService.getRoles()
    this.isAdmin = roles.includes('Admin')

    this.route.paramMap.subscribe(params => {
      const id = params.get('id')

      if (!id) {
        alert('Invalid id.')
        return
      }

      this.loadProfile(id)
      this.ownProfile = id === this.authService.getUserId()
    })
  }

  loadProfile(id: string) {
    this.loading = true
    this.profileService.getById(id).subscribe({
      next: (data) => {
        this.profile = data

        if (this.profile.warnedAt) {
          this.profile.warnedAt = this.profile.warnedAt + 'Z'
        }
        if (this.profile.bannedAt) {
          this.profile.bannedAt = this.profile.bannedAt + 'Z'
        }
        
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

  trackById = (_: number, m: MaterialShortViewDto) => m.id;

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

  warnUser(): void {
    if (!this.profile) return

    if (confirm(`Are you sure you want to warn ${this.profile.fullName}?`)) {
      this.profileService.warnUser(this.profile.id).subscribe({
        next: () => {
          alert('User warned successfully!')
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          alert('Failed to warn user: ' + (err.error?.message || 'Unknown error'))
        }
      })
    }
  }

  removeWarning(): void {
    if (!this.profile) return

    if (confirm(`Are you sure you want to remove the warning from ${this.profile.fullName}?`)) {
      this.profileService.removeWarning(this.profile.id).subscribe({
        next: () => {
          alert('Warning removed successfully!')
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          alert('Failed to remove warning: ' + (err.error?.message || 'Unknown error'))
        }
      })
    }
  }

  banUser(): void {
    if (!this.profile) return

    if (confirm(`Are you sure you want to BAN ${this.profile.fullName}? This will prevent them from logging in.`)) {
      this.profileService.banUser(this.profile.id).subscribe({
        next: () => {
          alert('User banned successfully!')
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          alert('Failed to ban user: ' + (err.error?.message || 'Unknown error'))
        }
      })
    }
  }

  unbanUser(): void {
    if (!this.profile) return

    if (confirm(`Are you sure you want to unban ${this.profile.fullName}?`)) {
      this.profileService.unbanUser(this.profile.id).subscribe({
        next: () => {
          alert('User unbanned successfully!')
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          alert('Failed to unban user: ' + (err.error?.message || 'Unknown error'))
        }
      })
    }
  }
}
