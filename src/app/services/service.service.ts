import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Service } from './service.model';
import { Ticket } from './ticket.model';
import * as firebase from 'firebase/app';
import { async } from '@angular/core/testing';
import { resolve } from 'url';



@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  service$: Observable<Service>;

  tickets$: Observable<Ticket>;
  private TicketsCollection: AngularFirestoreCollection<Ticket>;
  tickets: Observable<Ticket[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {


    this.service$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          return this.afs.doc<Service>(`services/${user.uid}`).valueChanges()
        } else {
          return of(null);
        }
      })
    );

    // global var
    
    let ServiceUid = firebase.auth().currentUser; // gets the uid of ther service

   // const ticketsRef = 

    // Retreive Tickets for this Service
    
   const ticketsQuery = 
      
    this.TicketsCollection = afs.collection<Ticket>('tickets', ref => {
       return ref
             .where('serviceUid', '==', ServiceUid.uid)
    });
    this.tickets = this.TicketsCollection.valueChanges();
 

  
   

  }

  testTickets() {
    if (this.tickets != null) {
      console.log(this.tickets);
    } else {
     console.log('err?');
    }
   }

  // create service and add it to database
  async serviceRegisterthroughEmail(value) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password) 
    this.afs.doc(`services/${credential.user.uid}`).set({
      uid: credential.user.uid,
      email: credential.user.email,
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/theuqs-52673.appspot.com/o/default%2FtempLogo.png?alt=media&token=0abc6b8c-a7e6-4b0f-bd52-6b6f9ccbdc65',
    });
  }

  // create service and add it to database
   async loginService(value) {
     await this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password) 
     return this.router.navigate(['/service/dashboard']);
  }

  async addcity() {
    let name1= "New york";
    let location1 = "USA";

    await this.afs.doc('cities/test').set({
      name: name1,
      location: location1
    });
  }

  // service sign out
  async serviceSignOut(){
    // sign out the service
    await this.afAuth.auth.signOut();
    // redirect to homepage
    return this.router.navigate(['/']);
  }

  // update service details
  async updateServiceDetails(value) {
    // get the user 
    const user = firebase.auth().currentUser;
    // check if ther is a user
    if (!user){
      // if there is no user 
      return this.router.navigate(['/']); // redirect to home
    } else {
      // if there is a user update the data
      this.afs.doc(`services/${user.uid}`).update({
        displayName: value.displayName,
        phoneNumber: value.phoneNumber
      })
    };
  }

  // upload profile picture
  async updatePhoto(event) {
    var user = firebase.auth().currentUser;
    // check if there is a user logged in
    if (!user) {
      // if there is no user 
      return this.router.navigate(['/']); // redirect to home
    }
      // if there is a user
      const serviceRef: AngularFirestoreDocument<Service> = this.afs.doc(`services/${user.uid}`);
      // root reference 
      const StorageRef = firebase.storage().ref();
      // reference the root to child folder
      const finaldestination = StorageRef.child('profilepictures');
      // get the target file
      const file = event.target.files[0];
      // lets name the file
      const fileName = 'service_' + user.uid;
      // upload the file
      const uploadTask = finaldestination.child(fileName).put(file);
      // Register three observers:
          // 1. 'state_changed' observer, called any time the state changes
          // 2. Error observer, called on failure
          // 3. Completion observer, called on successful completion
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...           
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log('File available at', downloadURL);
              const data = {
                uid: user.uid,
                email: user.email,
                photoUrl: downloadURL,
              };
              return serviceRef.set(data, { merge: true });
            });    
          });      
        }

   

        // 

}







