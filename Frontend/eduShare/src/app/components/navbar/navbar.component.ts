import { Component, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FavMaterialService } from '../../services/fav-material.service';
import { ToastService } from '../../services/toast.service';
import { filter } from 'rxjs';

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
  isAdmin: boolean = false
  navbarCollapsed = true

  constructor(private auth: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private fav: FavMaterialService,
    private modalService: NgbModal,
    private toast: ToastService) {
    router.events
    .pipe(filter(e=> e instanceof  NavigationEnd))
    .subscribe(() => {
      this.navbarCollapsed = true;
    })    
    //console.log('userid: ', auth.getUserId());
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.profileService.currentProfile$.subscribe({
      next: (data) => {
        this.profile = data
        //console.log(this.profile)
      },
      error: (err) => {
        console.error(err)
        this.toast.show('The profile could not be loaded.');
        this.auth.logout()
      }
    });

    const userId = this.auth.getUserId();
    if (userId) {
      this.profileService.getCurrentProfile(userId).subscribe();
    }

    this.isTeacher = this.auth.getRoles().some(r => r === 'Teacher' || r === 'Admin')
    this.isAdmin = this.auth.getRoles().some(r => r === 'Admin')
  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
  
  closeNavbar() {
    this.navbarCollapsed = true;
  }

  getProfileImageSrc(): string {
    const file = this.profile?.image?.file;
    if (!file) return 'assets/default-avatar.png'; // alapértelmezett kép
    return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
  }

  openFavs() {
    this.router.navigate(['/fav-materials'])
  }

  openProfile(): void {
    this.router.navigate(['/profile-view', this.auth.getUserId()])
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
