import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, timestamp } from 'rxjs/operators';
import { Service } from './service.model';
import { Ticket } from './ticket.model';
import { async } from '@angular/core/testing';
import { resolve } from 'url';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import {MatSnackBar} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component'

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  service$: Observable<Service>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public _snackbar: MatSnackBar
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
  }  
  

 async updatePassword(value){
   const user = firebase.auth().currentUser;
  user.updatePassword(value.newPassword).then( () => {
    this.afAuth.auth.signOut();
    const Message = "Password changed successully";
    const config = 'succonf'
    this.openSnackBar(Message, config);
  }, err => {
    this.afAuth.auth.signOut();
    const Message = err.message;
    const config = 'errconf'
    this.openSnackBar(Message, config);
  });
   
 }
  
  async facebookSignin(){
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    
    this.afs.doc(`userCollection/${credential.user.uid}`).set({
    uid: credential.user.uid,
    email: credential.user.email,
    photoUrl: 'https://firebasestorage.googleapis.com/v0/b/theuqs-52673.appspot.com/o/default%2FtempLogo.png?alt=media&token=0abc6b8c-a7e6-4b0f-bd52-6b6f9ccbdc65'
    });
  }

  // create service and add it to database
  async serviceRegisterthroughEmail(value) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password) 
    this.afs.doc(`services/${credential.user.uid}`).set({
      uid: credential.user.uid,
      email: credential.user.email,
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/theuqs-52673.appspot.com/o/default%2FppDef.png?alt=media&token=ee4c1229-d521-47a3-91f0-1c2cd70e2232',
    });

    
    return  this.sendEmailVerification();
  }

   // the snackbar method
   openSnackBar(Message: string, config: string) {
    this._snackbar.openFromComponent(SnackbarComponent, {
      data: Message,
      panelClass: config,
      duration:  5000,
    });
  }

  // create service and add it to database
   async loginService(value) {
     await this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password) 

   /*  const user = firebase.auth().currentUser;
     if (user.emailVerified) {
      return this.router.navigate(['/service/dashboard']);
     } else {
      this.afAuth.auth.signOut();
       const Message = "Service email not verified";
       const config = 'errconf'
       this.openSnackBar(Message, config);
       
     } */


     return this.router.navigate(['/service/dashboard']);
     
  }


    async checkAuth(){
      const user = firebase.auth().currentUser;

      if (!user){
       
      } else {
           // redirect to homepage
        return this.router.navigate(['/service/dashboard']);
      }
   
     
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
        phoneNumber: value.phoneNumber,
        abbreviation: value.abbreviation,
        categoryIndex: parseInt(value.cat),
        address: value.address,
        ticketCount: 0
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

  async sendEmailVerification() {
    const user = firebase.auth().currentUser;
    if (user) {
      console.log("email sent");
      user.sendEmailVerification();
    } else {
      return this.router.navigate(['/']); // redirect to home
    }
  }

   async updateprofiledata(value) {
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
        email: value.email,
        phoneNumber: value.phoneNumber
      })
    };
   }

        // 

}







