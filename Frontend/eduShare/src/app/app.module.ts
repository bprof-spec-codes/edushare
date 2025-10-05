import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialListComponent } from './components/material-list/material-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MaterialCreateComponent,
    MaterialListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
