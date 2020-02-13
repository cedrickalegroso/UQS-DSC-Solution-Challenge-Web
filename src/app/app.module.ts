import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomenavbarComponent } from './homenavbar/homenavbar.component';
import { RegisterServiceComponent, DialogUploadPhoto } from './register-service/register-service.component';
import { AppAuthComponent } from './app-auth/app-auth.component';


//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceComponent } from './service/service/service.component';
import { ServicedashboardComponent } from './servicedashboard/servicedashboard.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { ServicequeueComponent } from './servicequeue/servicequeue.component';
import { LoginServiceComponent } from './login-service/login-service.component';

// Material
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomenavbarComponent,
    RegisterServiceComponent,
    AppAuthComponent,
    SuperAdminComponent,
    ServiceComponent,
    DialogUploadPhoto,
    LoginServiceComponent,
    ServicedashboardComponent,
    SnackbarComponent,
    ServicequeueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [AngularFireStorage],
  bootstrap: [AppComponent],
  entryComponents: [DialogUploadPhoto, SnackbarComponent],
})
export class AppModule { }
