import { Component } from '@angular/core';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { AuthService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

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

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private confirmService: ConfirmService
  ) { }
  
  ngOnInit() {
    // Check if current user is admin
    const roles = this.authService.getRoles()
    this.isAdmin = roles.includes('Admin')

    this.route.paramMap.subscribe(params => {
      const id = params.get('id')

      if (!id) {
        this.toast.show('Invalid id.');
        return
      }

      this.loadProfile(id)
      this.ownProfile = id === this.authService.getUserId()
    })
  }

  loadProfile(id: string) {
    this.profile = null
    this.error = undefined
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
        
        //console.log(this.profile)
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.toast.show('Cannot load the profile.');
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

  async warnUser(): Promise<void> {
    if (!this.profile) return

    const confirmed = await this.confirmService.confirm(`Are you sure you want to warn ${this.profile.fullName}?`)
    if (confirmed) {
      this.profileService.warnUser(this.profile.id).subscribe({
        next: () => {
          this.toast.show('User warned successfully!');
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          this.toast.show('Failed to warn user: ' + (err.error?.message || 'Unknown error'));
        }
      })
    }
  }

  async removeWarning(): Promise<void> {
    if (!this.profile) return

    const confirmed = await this.confirmService.confirm(`Are you sure you want to remove the warning from ${this.profile.fullName}?`)
    if (confirmed) {
      this.profileService.removeWarning(this.profile.id).subscribe({
        next: () => {
          this.toast.show('Warning removed successfully!');
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          this.toast.show('Failed to remove warning: ' + (err.error?.message || 'Unknown error'));
        }
      })
    }
  }

  async banUser(): Promise<void> {
    if (!this.profile) return

    const confirmed = await this.confirmService.confirm(`Are you sure you want to BAN ${this.profile.fullName}? This will prevent them from logging in.`)
    if (confirmed) {
      this.profileService.banUser(this.profile.id).subscribe({
        next: () => {
          this.toast.show('User banned successfully!');
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          this.toast.show('Failed to ban user: ' + (err.error?.message || 'Unknown error'));
        }
      })
    }
  }

  async unbanUser(): Promise<void> {
    if (!this.profile) return

    const confirmed = await this.confirmService.confirm(`Are you sure you want to unban ${this.profile.fullName}?`)
    if (confirmed) {
      this.profileService.unbanUser(this.profile.id).subscribe({
        next: () => {
          this.toast.show('User unbanned successfully!');
          this.loadProfile(this.profile!.id)
        },
        error: (err) => {
          console.error(err)
          this.toast.show('Failed to unban user: ' + (err.error?.message || 'Unknown error'));
        }
      })
    }
  }
}
