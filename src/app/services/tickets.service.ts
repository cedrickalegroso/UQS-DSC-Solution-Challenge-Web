import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as admin from 'firebase-admin';
import 'firebase/firestore';
import { Component, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  tickets$: Observable<Ticket[]>;
  latestTicket$;
  liveTickets$: Observable<Ticket[]>;
  selected;
  nextTicket$: Observable<Ticket[]>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,

  )
  { 

    /* Tickets Status meanings 
      0 - Done
      1 - active but not shown in live queues since it doesnt have any teller
      2 - shown on live queues with a teller
    */

    this.tickets$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', user.uid)
                .where('ticketStatus', '==', 1 )
                .limit(5)
          });
          
         return  this.tickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.liveTickets$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', user.uid)
                .where('ticketStatus', '==', 2 )
                .limit(5)
          });
          
         return  this.liveTickets$ = this.TicketsCollection.valueChanges();
        } else {
          return of(null);
        }
      })
    );



  }

  ngOnInit() {
   



  }

  async ticketDone(ticket){
    let ref;
    let unixTimestamp = Math.floor(Date.now() / 1000);
    let ticketColl = this.afs.collection('tickets', ref => ref.where('refNo', '==', ticket.refNo));
    ticketColl.get().toPromise().then(
      function(querySnaphot) {
        if (querySnaphot.empty){
          console.log("ERROR: Could not find ticket");
        } else {
          querySnaphot.forEach( async function(doc) {
          ref = doc.data().refNo;
          ticketColl.doc(`${ref}`).update({
          ticketStatus: 0,
          timestampDone: unixTimestamp
          });   
          });
        }
      }
    )
    return this.notification(ticket);
  }

 
  async notification(ticket){
    let targetUid;
    let targetRaw;
    let service = firebase.auth().currentUser;
    let unixTimestamp = Math.floor(Date.now() / 1000);
    let target = ticket.ticketRaw + 5; // 10 
    let notifColl = this.afs.collection('notifications');
    let ticketColl = this.afs.collection('tickets', ref => ref.where('ticketRaw', '==', target).where('serviceUid', '==', ticket.serviceUid));
    ticketColl.get().toPromise().then(
      function(querySnaphot) {
        if (querySnaphot.empty) {
         // err
        } else {
         querySnaphot.forEach( async function(doc) {
           targetUid = doc.data().ticketOwnerUid;
           targetRaw = doc.data().ticketRaw; 
           let test = doc.data().ticketNo;
     
         let diff = target - ticket.ticketRaw ;
         let notifRef =  targetUid +  unixTimestamp;
         let finalMessage = "There are " + diff   + " person(s) before your turn. Please stay at the vicinity of the area.";


         
 
          console.log(test);
          console.log(finalMessage);
           notifColl.doc(`${notifRef}`).set({
           message: finalMessage,
           notifOwnerUid: 'VuE9JFHoriRD717k14PlW48uAcE2',
           notifService: service.uid,
           timestamp: unixTimestamp
         });  
         });
        }
      }
    ) 

    
   
  }

  // resets the ticket Count 
  async ticketCountReset(){
    let service = firebase.auth().currentUser;
    this.afs.collection('services').doc(`${service.uid}`).update({
      ticketCount: 0
    })
  }

  async sendMessage(){
    
  }

  async nextTicket(selected){
    let data;
    let service = firebase.auth().currentUser
    let ticketColl = this.afs.collection('tickets', ref => ref.where('ticketStatus', '==', 1).where('serviceUid', '==', service.uid).where('teller', '==', 0).orderBy('ticketRaw', 'asc').limit(1))
    ticketColl.get().toPromise().then(
      function(querySnaphot) {
        if(querySnaphot.empty) {
          console.log("EMPTY");   
        } else {
          querySnaphot.forEach( async function(doc) {
            data = doc.data();
            console.log(data.ticketNo);
            ticketColl.doc(`${data.refNo}`).update({
              teller: selected,
              ticketStatus: 2
            });
            
            this.afs.collection('fcmTokens').doc(data.ticketOwnerUid).get().toPromise()
            .then((doc) => {
                let Token = doc.data().token 

                var payload = {
                  notification: {
                    title: 'Success',
                    body: 'Your ticket now have a teller'
                  }
                }


            });
          });
        }
      }
    ) 
    this.nextTicket$ = ticketColl.get().pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = this.afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', service.uid)
                .where('ticketStatus', '==', 2 )
                .where('teller', '==', selected )
                .limit(1)
          });
        
         return  this.nextTicket$ = this.TicketsCollection.valueChanges();

        } else {
          return of(null);
        }
      })
    );
  }  


  async autoIdTicket() {
    let data;
    let unixTimestamp = Math.floor(Date.now() / 1000);
    let service = firebase.auth().currentUser;
    let ticketColl = this.afs.collection('tickets', ref => ref.orderBy('ticketRaw', 'desc').where('serviceUid', '==', service.uid).limit(1))
    ticketColl.get().toPromise().then(
      function(querySnaphot) {
      
        
         if (querySnaphot.empty) {
          console.log("empty")
          ticketColl.doc(`${ 1 + unixTimestamp }`).set({
            refNo: 'TEST',
            serviceUid: service.uid,
            ticketNo: 'TEST' + 1,
            ticketRaw: 1,
            ticketOwnerUid: 'TEST',
            timestamp:  Math.floor(Date.now() / 1000)
          });
         } else {
          querySnaphot.forEach( async function(doc) {
            data = doc.data();
            let ticketRaw1 = data.ticketRaw + 1;
            let ticketOwnerUid = "15VTijHFqoTgmXowy38BlFjPJJ43"
            let refNo ='TEST' + ticketRaw1 + unixTimestamp;
            let ticketFinal = 'TEST' + ticketRaw1;

            ticketColl.doc(`${refNo}`).set({
              refNo: refNo,
              serviceUid: service.uid,
              ticketNo: ticketFinal,
              ticketRaw: ticketRaw1,  
              ticketOwnerUid: ticketOwnerUid,
              timestamp:  Math.floor(Date.now() / 1000)
            });
          }
          )
         }
        }
      /*  querySnaphot.forEach( async function(doc) {
          data = doc.data();
          console.log(data)
          if (doc.exists) {
            data = doc.data();
            
            let ticketRaw1 = data.ticketRaw + 1;
            let unixTimestamp = Math.floor(Date.now() / 1000);
            let ticketOwnerUid = "15VTijHFqoTgmXowy38BlFjPJJ43"
            let refNo ='TEST' + ticketRaw1 + unixTimestamp;
            let ticketFinal = 'TEST' + ticketRaw1;

            if (data.ticketRaw >= 1  ) {    
              console.log(114)         
              ticketColl.doc(`${refNo}`).set({
                  refNo: refNo,
                  serviceUid: service.uid,
                  ticketNo: ticketFinal,
                  ticketRaw: ticketRaw1,  
                  ticketOwnerUid: ticketOwnerUid,
                  timestamp:  Math.floor(Date.now() / 1000)
                });
            } else {
              console.log(115)
              ticketColl.doc(`${refNo}`).set({
                refNo: refNo,
                serviceUid: service.uid,
                ticketNo: 'TEST' + 1,
                ticketRaw: 1,
                ticketOwnerUid: ticketOwnerUid,
                timestamp:  Math.floor(Date.now() / 1000)
              });
            }


          } else {
            console.log("Error getting ticket");
          } 
        }); */
     
    ) 
  }   


 

}


   //  deprecated 

 /*
   async injecTicket(value){
    let service = firebase.auth().currentUser;
    let ticketOwnerUid1 = '30I9qlK4OfZbeBGpzljWfHFuFcL2'
    let unixTimestamp = Math.floor(Date.now() / 1000)
    let refNo = 'TEST' + value.ticketNo + unixTimestamp
   

    await this.afs.doc(`tickets/${refNo}`).set({
      refNo: refNo,
      serviceUid: service.uid,
      ticketNo: "TEST" + value.ticketNo,
      ticketRaw: value.ticketNo,
      ticketOwnerUid: ticketOwnerUid1,
      timestamp:  Math.floor(Date.now() / 1000)
    })

  } */