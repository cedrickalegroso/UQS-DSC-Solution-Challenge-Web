import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  tickets$: Observable<Ticket[]>;
  latestTicket$;
  id;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) { 
    this.tickets$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', user.uid)
                .limit(3)
          });
          
         return  this.tickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async injecTicket(value){
    let serviceUid = this.afAuth.auth.currentUser;
    let ticketOwnerUid1 = '30I9qlK4OfZbeBGpzljWfHFuFcL2'
    let unixTimestamp = Math.floor(Date.now() / 1000)
    let refNo = 'bdo' + value.ticketNo + unixTimestamp
   

    await this.afs.doc(`tickets/${refNo}`).set({
      refNo: refNo,
      serviceUid: serviceUid.uid,
      ticketNo: value.ticketNo,
      ticketOwnerUid: ticketOwnerUid1,
      timestamp:  Math.floor(Date.now() / 1000)
    })

  // call the last level 
  return this.ticketcounter();
  }

  async ticketcounter(){
    let serviceUid = this.afAuth.auth.currentUser;
    
    let test1 = 

    console.log('test1 intiated ' + this.afs.doc(`services/${serviceUid.uid}/ticketCount`).get())
    // await this.afs.doc(`services/${serviceUid.uid}`).update({
      // ticketCount: this.ticketCount + 1
   //  })
  }

  async autoIdTicket() {
    //query the collection to get the lates ticketNo

    // ref
    this.latestTicket$ = this.afs.collection<Ticket>('tickets', ref => {
       return ref
         .orderBy("timestamp", "desc")
         .limit(1)
    });
  

    this.id = this.TicketsCollection.valueChanges();

    this.TicketsCollection.doc(this.id).ref.get().then(function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }

}
