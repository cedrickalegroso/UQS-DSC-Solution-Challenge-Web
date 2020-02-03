import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import { ServiceService } from '../services/service.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component'



@Component({
  selector: 'app-login-service',
  templateUrl: './login-service.component.html',
  styleUrls: ['./login-service.component.scss']
})
export class LoginServiceComponent implements OnInit {

  loginEmailForm: FormGroup;

  constructor(
    public auth: AuthService,
    public service: ServiceService,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginEmailForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

     // the snackbar method
     openSnackBar(Message: string, config: string) {
      this._snackbar.openFromComponent(SnackbarComponent, {
        data: Message,
        panelClass: config,
        duration:  5000,
      });
    }


  tryLoginService(value){
    // call the function
   this.service.loginService(value)
    // get the res and err
   .then( res=> {
     console.log(res);
   }, err => {
    // pass the error to snackbar
    // get the message 
    const Message = err.message;
    // config
    const config = 'errconf'
    // call the snackbar
    this.openSnackBar(Message, config);
   })
    
  }

}
