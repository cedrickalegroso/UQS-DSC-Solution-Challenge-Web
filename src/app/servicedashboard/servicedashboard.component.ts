import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import * as firebase from 'firebase/app';
import { Ticket } from '../services/ticket.model';

@Component({
  selector: 'app-servicedashboard',
  templateUrl: './servicedashboard.component.html',
  styleUrls: ['./servicedashboard.component.scss']
})
export class ServicedashboardComponent implements OnInit {


  TicketInjectForm: FormGroup; // for testing tickets only!

  constructor(
    public service: ServiceService,
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

     this.TicketInjectForm = this._formBuilder.group({
      ticketNo: ['', Validators.required],
    });

  }
  
  // test only

  testtickets(){
   this.service.testTickets();
  }


  /* 
    
  @gaille
     
     Database collection: tickets
     Method name should be: injecTicket
     Form here call the method in the service.service.ts 

     example:

        MethodName(value){
          this.service."functionsname"(value)
          .then( res => {
            console.log(res);
          }, err => {
            console.log(err);
          });
        }

     because this is for testing purpose only prepare some data to be 
     inject on the database 
    
     needed field in the database is: 
     serviceUid: <- default data should be: YeDfP4taedaXkv8EEDzMwcHk8Rj2
     ticketNo:  value.ticketNo
     ticketOwnerUid: <- default data should be: 30I9qlK4OfZbeBGpzljWfHFuFcL2

     
     
  */

  injecTicket(value){
    this.service.injecTicket(value)
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