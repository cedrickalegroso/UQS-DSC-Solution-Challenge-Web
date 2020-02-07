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

  constructor(
    public service: ServiceService,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {

   
  

  }
  
  // test only
  testtickets(){
   this.service.testTickets();
  }

   serviceSignOut() {
     // call the function to sign out the service
    this.service.serviceSignOut();
  }

}