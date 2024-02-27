import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSampleTaskComponent } from './add-sampleTask/add-sampleTask.component';
import { EditSampleTaskComponent } from './edit-sampleTask/edit-sampleTask.component';
import { HomeComponent } from './home/home.component';
import { ViewSampleTaskComponent } from './view-sampleTask/view-sampleTask.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';

const routes: Routes = [
  // { path: '', component: LoginComponent, pathMatch: 'full'},
  // { path: 'logout', component: LogoutComponent },

  { path: '', redirectTo: 'Home', pathMatch: 'full'},
  { path: 'Home', component: HomeComponent },
  { path: 'ViewSampleTask/:sampleTaskId', component: ViewSampleTaskComponent },
  { path: 'AddSampleTask', component: AddSampleTaskComponent },
  { path: 'EditSampleTask/:sampleTaskId', component: EditSampleTaskComponent } 
];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }