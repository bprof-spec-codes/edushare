import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './interceptors/login.interceptor';
import { MaterialViewComponent } from './components/material-view/material-view.component';
import { MaterialUpdateComponent } from './components/material-update/material-update.component';
import { MaterialFormComponent } from './components/material-form/material-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MaterialCreateComponent,
    MaterialListComponent,
    HomepageComponent,
    RegisterComponent,
    MaterialViewComponent,
    MaterialUpdateComponent,
    MaterialFormComponent,
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
