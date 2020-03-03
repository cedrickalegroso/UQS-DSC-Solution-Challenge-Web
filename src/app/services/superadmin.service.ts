import { Injectable } from '@angular/core';
import { SuperAdmin } from './superadmin.model';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
 superAdmins$: Observable<SuperAdmin>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    this.superAdmins$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          return this.afs.doc<SuperAdmin>(`superadmins/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  async SuperAdminSignup(value) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
    return this.SuperAdminCreate(credential.user);
  }

  async SuperAdminSignin(value){
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password);
    return this.SuperAdminCreate(credential.user);
  }

  private SuperAdminCreate(user) {
    const userRef: AngularFirestoreDocument<SuperAdmin> = this.afs.doc(`superadmins/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email
    }
    this.router.navigate(['/admin']);
    return userRef.set(data, {merge: true});
  }
}
