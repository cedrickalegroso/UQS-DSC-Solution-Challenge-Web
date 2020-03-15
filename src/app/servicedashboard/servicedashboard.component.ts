import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import * as firebase from 'firebase/app';
import { Ticket } from '../services/ticket.model';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { TicketsService } from '../services/tickets.service';

@Component({
  selector: 'app-servicedashboard',
  templateUrl: './servicedashboard.component.html',
  styleUrls: ['./servicedashboard.component.scss']
})
export class ServicedashboardComponent implements OnInit {

  mode: ProgressSpinnerMode = 'indeterminate';
  TicketInjectForm: FormGroup; // for testing tickets only!

  constructor(
    public service: ServiceService,
    private ticket: TicketsService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user.uid);
      } else {
        console.log("0");
      }
    });
     
    // for testing tickets only!
     this.TicketInjectForm = this._formBuilder.group({
      ticketNo: ['', Validators.required],
    });
   
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SelectTellerNoDialog, {
      width: '400px',
      height: '600px'
    });

   
  }


  
  openProfileDialog(): void {
    const dialogRef = this.dialog.open(profileDialog, {
      width: '400px',
      height: '600px'
    });

   
  }


  
  ticketDone(ticket){
    this.ticket.ticketDone(ticket)
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  }


  injectwithAutoId(){
    this.ticket.autoIdTicket()
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  }

   serviceSignOut() {
     // call the function to sign out the service
    this.service.serviceSignOut();
  }

}

@Component({
  selector: 'app-servicedashboard',
  templateUrl: 'selectTellerDialog.html',
})
export class SelectTellerNoDialog {

  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(
    public dialogRef: MatDialogRef<SelectTellerNoDialog>,
    public dialog: MatDialog,
    private ticket: TicketsService,
    ) {

    }

  tellers: any[] = [
    { id: 1, name: 'Teller 1' },
    { id: 2, name: 'Teller 2' },
    { id: 3, name: 'Teller 3' },
    { id: 4, name: 'Teller 4' },
    { id: 5, name: 'Teller 5' },
    { id: 6, name: 'Teller 6' }
  ];
  selected: number ;


  nextTicket(selected){
    this.ticket.nextTicket(selected)
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  }


  selectTeller(id: number) {
    this.selected = id
 
  }

  ticketDone(ticket){
    this.ticket.ticketDone(ticket)
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  }



  close(teller){
    this.dialogRef.close(teller);
    console.log(teller.id)
  }
}


@Component({
  selector: 'app-servicedashboard',
  templateUrl: 'profileDialog.html',
})
export class profileDialog {

  mode: ProgressSpinnerMode = 'indeterminate';
  editMode = false;
  dataUpdate: FormGroup;
  constructor(
    public service: ServiceService,
    private ticket: TicketsService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    ) { }

    ngOnInit() {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user.uid);
        } else {
          console.log("0");
        }
      });

      this.dataUpdate = this._formBuilder.group({
        displayName: ['', Validators.required],
        email: ['', Validators.required],
        phoneNumber: ['', Validators.required]
      });

    }    
 

    updateData(value){
      console.log(value.displayName);
      console.log(value.email);
      console.log(value.phoneNumber);
    }

    uploadPhotoDialog(): void {
      const dialogRef = this.dialog.open(uploadProdilePicture, {
        width: '400px',
        height: '600px'
      });
  
     
    }

}


@Component({
  selector: 'app-servicedashboard',
  templateUrl: 'uploadProfilePicture.html',
})
export class uploadProdilePicture {

  mode: ProgressSpinnerMode = 'indeterminate';
  uploadPhotoForm: FormGroup;
  constructor(
    public service: ServiceService,
    private ticket: TicketsService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    ) { 
      this.uploadPhotoForm = this._formBuilder.group({
        file: ['', Validators.required],
      });
    }

    ngOnInit() {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user.uid);
        } else {
          console.log("0");
        }
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