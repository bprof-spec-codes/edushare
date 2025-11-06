import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './guards/login.service';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { MaterialViewComponent } from './components/material-view/material-view.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { MaterialUpdateComponent } from './components/material-update/material-update.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { roleGuard } from './guards/role.guard';
import { MaterialSearchListComponent } from './components/material-search-list/material-search-list.component';
import { MainlistComponent } from './components/mainlist/mainlist.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent , canActivate:[NoAuthGuard]},
      { path: 'register', component: RegisterComponent, canActivate:[NoAuthGuard] },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'homepage', component: HomepageComponent },
      { path: 'materials', component: MaterialListComponent },
      { path: 'materials/create', component: MaterialCreateComponent, canActivate: [AuthGuard] },
      { path: 'materials/:id/update', component: MaterialUpdateComponent, canActivate: [AuthGuard] },
      { path: 'materials/:id/view', component: MaterialViewComponent },
      { path: 'profile-list', component: ProfileListComponent },
      { path: 'profile-view/:id', component: ProfileViewComponent },
      { path: 'profile-update/:id', component: ProfileUpdateComponent, canActivate: [AuthGuard] },
      { path: 'subjects', component: SubjectListComponent, canActivate: [roleGuard], data: { roles: ['Teacher', 'Admin'] } },
      { path: 'material-search', component: MaterialSearchListComponent},
      { path: 'mainlist', component: MainlistComponent}
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
