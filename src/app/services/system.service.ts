import { Injectable } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { VersionControl } from './versionControl.model';
import { switchMap } from 'rxjs/operators';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private VersionControlCollection: AngularFirestoreCollection<VersionControl>;
  Version$: Observable<VersionControl[]>;

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    this.Version$ = this.afauth.authState.pipe(
      switchMap( user => {
        if (user) {
          this.VersionControlCollection = this.afs.collection<VersionControl>('versionContrl', ref => {
            return ref
                 .orderBy('timestamp', 'asc')
                 .limit(3)
          })
          return this.Version$ = this.VersionControlCollection.valueChanges();
        } else {
          return of(null);
        }
      }) 
    )
  }

  async VersioncontrolUpdate(value){
    let unixTimeStamp = Math.floor(Date.now() / 1000);
    let refNo = unixTimeStamp;

    await this.afs.doc(`versionControl/${refNo}`).set({
      versionNo: value.versionNo,
      description: value.description,
      timestamp:  Math.floor(Date.now() / 1000)
    });
  }
}
