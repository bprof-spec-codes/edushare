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

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'homepage', component: HomepageComponent},
  { path: 'materials/create', component: MaterialCreateComponent, canActivate: [AuthGuard] },
  { path: 'materials/:id/update', component: MaterialUpdateComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'materials', component: MaterialListComponent, canActivate: [AuthGuard] },
  { path: 'materials/:id/view', component: MaterialViewComponent, canActivate: [AuthGuard] },
  { path: 'profile-list', component: ProfileListComponent, canActivate: [AuthGuard] },
  { path: 'profile-view/:id', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'profile-update/:id', component: ProfileUpdateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
