import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as admin from 'firebase-admin';
import 'firebase/firestore';
import { Component, OnInit } from '@angular/core';
const increment = firebase.firestore.FieldValue.increment(1);

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  readonly ROOT_URL_notifyNewTeller = 'https://us-central1-theuqs-52673.cloudfunctions.net/app/api/newTellerNotify:uid:teller';
  readonly ROOT_URL_notifyNext = 'https://us-central1-theuqs-52673.cloudfunctions.net/app/api/ticketDone:refNo';
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  tickets$: Observable<Ticket[]>;
  latestTicket$;
  liveTickets$: Observable<Ticket[]>;
  selected;
  nextTicket$: Observable<Ticket[]>;
  ticketDataFinal;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,

  ) {

    /* Tickets Status meanings 
      0 - Done
      1 - active but not shown in live queues since it doesnt have any teller
      2 - shown on live queues with a teller
    */

    this.tickets$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
            return ref
              .where('serviceUid', '==', user.uid)
              .where('ticketStatus', '==', 1)
              .limit(5)
          });

          return this.tickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.liveTickets$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
            return ref
              .where('serviceUid', '==', user.uid)
              .where('ticketStatus', '==', 2)
              .limit(5)
          });

          return this.liveTickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );



  }

  ngOnInit() {

  }

  async ticketDone(ticket) {
    let unixTimestamp = Math.floor(Date.now() / 1000);

    this.afs.collection('tickets').doc(ticket.refNo).update({
      ticketStatus: 3,
      timestampDone: unixTimestamp
    })

    this.afs.collection('services').doc(ticket.serviceUid).update({
     ticketCountDone: increment
    })

    const ticketData = {
      refNo: ticket.refNo,
    }

    this.http.post(this.ROOT_URL_notifyNext, ticketData).toPromise().then(data => {
      console.log(data)
    });

  }

  // resets the ticket Count 
  async ticketCountReset() {
    let service = firebase.auth().currentUser;
    this.afs.collection('services').doc(`${service.uid}`).update({
      ticketCount: 0,
      ticketCountDone: 0
    })
  }

  async ticketCountUpdate(value) {
    let service = firebase.auth().currentUser;
    this.afs.collection('services').doc(`${service.uid}`).update({
      ticketCount: parseInt(value.count)
    })
  }

  async ticketCountDoneUpdate(value) {
    let service = firebase.auth().currentUser;
    this.afs.collection('services').doc(`${service.uid}`).update({
      ticketCountDone: parseInt(value.count)
    })
  }

  async nextTicket(selected) {
    let service = firebase.auth().currentUser
    let ticketColl = this.afs.collection('tickets', ref => ref.where('ticketStatus', '==', 1).where('serviceUid', '==', service.uid).where('teller', '==', 0).orderBy('ticketRaw', 'asc').limit(1))
    ticketColl.get().toPromise().then(
      function (querySnaphot) {
        if (querySnaphot.empty) {
          console.log("EMPTY");
        } else {
          querySnaphot.forEach(async function (doc) {
            let data = doc.data()

            ticketColl.doc(`${data.refNo}`).update({
              teller: parseInt(selected),
              ticketStatus: 2
            });

          });
        }
      }
    )

    this.nextTicket$ = ticketColl.get().pipe(
      switchMap(user => {
        if (user) {
          this.TicketsCollection = this.afs.collection<Ticket>('tickets', ref => {
            return ref
              .where('serviceUid', '==', service.uid)
              .where('ticketStatus', '==', 2)
              .where('teller', '==', parseInt(selected))
              .limit(1)
          });

          return this.nextTicket$ = this.TicketsCollection.valueChanges();

        } else {
          return of(null);
        }
      })
    );


  }


}
