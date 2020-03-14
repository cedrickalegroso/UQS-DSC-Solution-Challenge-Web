import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Component, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  tickets$: Observable<Ticket[]>;
  latestTicket$;
  activeTickets$;
  selected;
  nextTicket$: Observable<Ticket[]>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  )
  { 
    this.tickets$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
             return ref 
                .where('serviceUid', '==', user.uid)
                .where('ticketStatus', '==', 1 )
                .where('ticketStatus', '>', 0 )
                .limit(5)
          });
          
         return  this.tickets$ = this.TicketsCollection.valueChanges();
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
  }

  async countActiveTicket(){
   let data;
   let service = firebase.auth().currentUser;
   let ticketColl = this.afs.collection('tickets', ref => ref.where('serviceUid', '==', service.uid).where('ticketStatus', '==', 1));
   ticketColl.get().toPromise().then(
     snap => {
       console.log(snap.size);
       return this.activeTickets$ = snap.size;
     }
   )
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
              teller: selected
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
                .where('ticketStatus', '==', 1 )
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