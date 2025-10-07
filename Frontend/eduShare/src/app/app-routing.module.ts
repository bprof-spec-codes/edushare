import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './guards/login.service';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './guards/login.service';
import { HomepageComponent } from './components/homepage/homepage.component';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { MaterialViewComponent } from './components/material-view/material-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'create-material', component: MaterialCreateComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'list-materials', component: MaterialListComponent, canActivate: [AuthGuard] },
  { path: 'material-view/:id', component: MaterialViewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
