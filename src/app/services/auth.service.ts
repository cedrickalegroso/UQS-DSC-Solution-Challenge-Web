import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
   user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) { 
    this.user$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          return this.afs.doc<User>(`superadmins/${user.uid}`).valueChanges()
        } else {
          return of(null);
        }
      })
    );
  }

  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }


  async SuperAdminemailSignup(value) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password) 
    return this.SuperAdminCreate(credential.user);
  }

  
  async userRegisterInfo(value){
    const user = firebase.auth().currentUser;
    if (user != null ) {
      this.updateUserinfo(user, value);
      user.sendEmailVerification(); 
    } else {
      console.log("there is no authenticated user :< ")
    }
  }


  async SuperAdminemailSignin(value) {
   await this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password) 
   this.router.navigate(['/admin']); // redirect to superadmin Dashboard
  }


  async updateAvatarPhotoURL(avatar) {

       console.log('ayayay')
       var user = firebase.auth().currentUser;
       this.afs.doc(`users/${user.uid}`).update({
        photoURL: avatar.photoURL
       });
 

  }

  async updateEmail(value) {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user.emailVerified) {
        console.log('email verified');
      }
      else {
        user.sendEmailVerification(); 
        console.log("email sent");
       
      }
    });
    //return this.updateUserDisplayname(user, value); 
  }

  async verifyEmail() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user.emailVerified) {
        console.log('email verified');
      }
      else {
        console.log("email not verified ");
      }
    });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
     
    };
        
        this.router.navigate(['/home']);
        return userRef.set(data, { merge: true });
  }


  private SuperAdminCreate(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`superadmins/${user.uid}`);

     
   

    const data = {
      uid: user.uid,
      email: user.email,
     
    };
        
        this.router.navigate(['/admin']); // redirect to superadmin Dashboard
        return userRef.set(data, { merge: true });
  }


  private updateUserinfo(user, value) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

     
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: value.displayName,
      userName: value.userName,
      phoneNumber: value.phoneNumber,
    };


        
        return userRef.set(data, { merge: true });
  }


 
  
}
