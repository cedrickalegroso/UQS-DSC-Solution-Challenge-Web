import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterServiceComponent } from './register-service/register-service.component';
import { AppAuthComponent } from './app-auth/app-auth.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { from } from 'rxjs';
import { LoginServiceComponent } from './login-service/login-service.component';
import { ServicedashboardComponent } from './servicedashboard/servicedashboard.component';
import { ServicequeueComponent } from './servicequeue/servicequeue.component';
import { TellerAuthComponent } from './teller-auth/teller-auth.component';
import { DocsComponent } from './docs/docs.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'adminauth',
    component: AppAuthComponent
  },

  {
    path: 'admin',
    component: SuperAdminComponent
  },

  {
    path: 'login',
    component: LoginServiceComponent
  },

  {
    path: 'register',
    component: RegisterServiceComponent
  },

  {
    path: 'service/dashboard',
    component: ServicedashboardComponent
  },

  {
   path: 'teller/auth',
   component: TellerAuthComponent
  },
  {
    path: 'service/livequeue',
    component: ServicequeueComponent
  },
  {
    path: 'docs',
    component: DocsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
