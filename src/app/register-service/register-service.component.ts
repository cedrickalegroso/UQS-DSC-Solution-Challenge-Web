import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import { ServiceService } from '../services/service.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SnackbarComponent } from '../snackbar/snackbar.component'
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-service',
  templateUrl: './register-service.component.html',
  styleUrls: ['./register-service.component.scss']
})
export class RegisterServiceComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loginFormGroup: FormGroup;


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

    firebase.auth().onAuthStateChanged(function(service) {
      if (service) {
        console.log(service.email);
      } else {
        console.log("0");
      }
    });

    this.firstFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      displayName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
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

  tryRegister(value){
    // call the function
    this.service.serviceRegisterthroughEmail(value)
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
    });
  }

 

  tryUpdateService(value){
    // call the function
    this.service.updateServiceDetails(value)
     // get the res and err
    .then( res=> {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }




  openDialog(): void{
    const dialogRef = this.dialog.open(DialogUploadPhoto, {
    width: '540px',
    height: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
     console.log(result);
    });
  }

}

  @Component({
    selector: 'app-register-service',
    templateUrl: 'dialog-upload-photo.html',
  })
  export class DialogUploadPhoto {
    uploadPhotoForm: FormGroup;
    constructor(
      public dialogRef: MatDialogRef<DialogUploadPhoto>,
      public dialog: MatDialog,
      public service: ServiceService,
      private readonly afs: AngularFirestore,
      private _formBuilder: FormBuilder,
    ) {
      this.uploadPhotoForm = this._formBuilder.group({
        file: ['', Validators.required],
      });
    }
    uploadPhoto(event){
      // call this function
      this.service.updatePhoto(event)
      // get the res and err
      .then( res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
}


