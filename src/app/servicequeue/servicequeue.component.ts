import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import { TicketsService } from '../services/tickets.service';
import * as firebase from 'firebase/app';
import { Ticket } from '../services/ticket.model';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-servicequeue',
  templateUrl: './servicequeue.component.html',
  styleUrls: ['./servicequeue.component.scss']
})
export class ServicequeueComponent implements OnInit {
  mode: ProgressSpinnerMode = 'indeterminate';
  time = new Date ();
  timer;
  constructor(
    private service: ServiceService,
    private ticket: TicketsService,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {

    this.timer = setInterval( () => {
      this.time = new Date();
  }, 1000 );
  }




   
}
