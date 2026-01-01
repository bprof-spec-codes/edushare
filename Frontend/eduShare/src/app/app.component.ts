import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from './services/authentication.service';
import { FavMaterialService } from './services/fav-material.service';
import { BanMonitorService } from './services/ban-monitor.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'eduShare';

  showSnow = false;

  // ide írd azokat, ahol kell a hó
  private snowRoutes = new Set<string>(['/homepage', '/login', '/register']);

  constructor(public auth:AuthService,private fav:FavMaterialService, private banmonitor: BanMonitorService, private router:Router) {
      
    if (this.auth.isLoggedIn()) {
        this.fav.getAll().subscribe()
        this.banmonitor.startMonitoring()
    }

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects.split('?')[0];
        this.showSnow = this.snowRoutes.has(url);
      });
  }
}
