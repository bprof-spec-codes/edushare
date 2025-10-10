import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialCreateUpdateComponent } from './components/material-create-update/material-create-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './interceptors/login.interceptor';
import { MaterialViewComponent } from './components/material-view/material-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MaterialCreateUpdateComponent,
    MaterialListComponent,
    HomepageComponent,
    RegisterComponent,
    MaterialViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    LoginComponent,
    FormsModule,
    DatePipe,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
