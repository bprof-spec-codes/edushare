import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialCreateComponent } from './components/material-create/material-create.component';
import { MaterialListComponent } from './components/material-list/material-list.component';

const routes: Routes = [
  {path:"",redirectTo: "create-material",pathMatch:"full"},
  {path:"create-material",component: MaterialCreateComponent},
  {path:"list-materials",component: MaterialListComponent},
  {path:"**",redirectTo:"create-material",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
