import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from './services/authentication.service';
import { FavMaterialService } from './services/fav-material.service';
import { BanMonitorService } from './services/ban-monitor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'eduShare';
  constructor(public auth:AuthService,private fav:FavMaterialService, private banmonitor: BanMonitorService) {
      if (this.auth.isLoggedIn()) {
        this.fav.getAll().subscribe()
        this.banmonitor.startMonitoring()
    }
  }
}
