import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialCreateComponent } from './pages/material-create/material-create.component';
import { LoginComponent } from './components/authentication/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-material', component: MaterialCreateComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
