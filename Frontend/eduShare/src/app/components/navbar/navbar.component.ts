import { Component, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FavMaterialService } from '../../services/fav-material.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent implements OnChanges, OnInit {
  isLoggedIn: boolean = false;
  profile: ProfileViewDto | null = null
  id: string = ''
  isTeacher: boolean = false

  constructor(private auth: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private fav: FavMaterialService,
    private modalService: NgbModal) {
    console.log('userid: ', auth.getUserId());
  }

  ngOnInit(): void {
    this.id = this.auth.getUserId() || '';
    this.isLoggedIn = this.auth.isLoggedIn()
    this.profileService.getById(this.id).subscribe({
      next: (data) => {
        this.profile = data
        console.log(this.profile)
      },
      error: (err) => {
        console.error(err)
        alert('Nem sikerült betölteni a profilt.')
        this.auth.logout()
      }
    })
    this.isTeacher = this.auth.getRoles().some(r => r === 'Teacher' || r === 'Admin')
  }

  getProfileImageSrc(): string {
    const file = this.profile?.image?.file;
    if (!file) return 'assets/default-avatar.png'; // alapértelmezett kép
    return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
  }

  openFavs(){
    this.router.navigate(['/fav-materials'])
  }

  openProfile(profileId: string): void {
    this.router.navigate(['/profile-view', profileId])
  }

  ngOnChanges() {
    this.isLoggedIn = this.auth.isLoggedIn()
  }

  //openLogoutModal(content: any) {
  //  this.modalService.open(content,{centered: true})
  //}

  logout() {
  //  this.modalService.dismissAll()
  this.fav.clear()
  this.auth.logout()
  }
}
