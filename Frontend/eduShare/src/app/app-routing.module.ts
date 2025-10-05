import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialCreateComponent } from './components/material-create/material-create.component';

const routes: Routes = [
  {path:"",redirectTo: "create-material",pathMatch:"full"},
  {path:"create-material",component: MaterialCreateComponent},
  {path:"**",redirectTo:"create-material",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
