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

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'materials/create', component: MaterialCreateComponent, canActivate: [AuthGuard] },
  { path: 'materials/:id/update', component: MaterialUpdateComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'list-materials', component: MaterialListComponent, canActivate: [AuthGuard] },
  { path: 'material-view/:id', component: MaterialViewComponent, canActivate: [AuthGuard] },
  { path: 'profile-list', component: ProfileListComponent, canActivate: [AuthGuard] },
  { path: 'profile-view/:id', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
