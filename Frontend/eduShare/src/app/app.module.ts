import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialCardComponent } from './components/material-card/material-card.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectCreateModalComponent } from './components/subject-create-modal/subject-create-modal.component';
import { SubjectUpdateFormComponent } from './components/subject-update-form/subject-update-form.component';
import { FavMaterialsComponent } from './components/fav-materials/fav-materials.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { MaterialSearchListComponent } from './components/material-search-list/material-search-list.component';
import { MainlistComponent } from './components/mainlist/mainlist.component';
import { RatingCreateModalComponent } from './components/rating-create-modal/rating-create-modal.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { RatingCardComponent } from './components/rating-card/rating-card.component';
import { RatingCommentModalComponent } from './components/rating-comment-modal/rating-comment-modal.component';
import { RatingDatePipe } from './pipes/rating-date.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MaterialCreateComponent,
    MaterialListComponent,
    HomepageComponent,
    MaterialViewComponent,
    MaterialUpdateComponent,
    MaterialFormComponent,
    ProfileListComponent,
    ProfileViewComponent,
    ProfileUpdateComponent,
    FooterComponent,
    MaterialCardComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    SubjectListComponent,
    SubjectCreateModalComponent,
    SubjectUpdateFormComponent,
    FavMaterialsComponent,
    MaterialSearchListComponent,
    SearchbarComponent,
    MainlistComponent,
    RatingCreateModalComponent,
    RatingStarsComponent,
    RatingCardComponent,
    RatingCommentModalComponent,
    RatingDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    RegisterComponent,
    LoginComponent,
    RatingDatePipe
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
