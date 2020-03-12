import { Injectable } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Ticket } from './ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TellerService {
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  nextTicket$: Observable<Ticket[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    this.nextTicket$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', user.uid)
                .where('ticketStatus', '==', 1 )
          
          });
          
        // return  this.tickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );

   }
}
