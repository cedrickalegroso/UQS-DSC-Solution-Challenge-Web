import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import * as firebase from 'firebase/app';
import { Ticket } from '../services/ticket.model';

@Component({
  selector: 'app-servicequeue',
  templateUrl: './servicequeue.component.html',
  styleUrls: ['./servicequeue.component.scss']
})
export class ServicequeueComponent implements OnInit {

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
    
  }

  testtickets(){
    this.service.testTickets();
   }

   
}
