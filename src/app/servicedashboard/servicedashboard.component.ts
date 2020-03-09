import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
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

  test(){
    this.ticket.nextTicket();
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