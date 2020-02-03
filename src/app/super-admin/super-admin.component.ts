import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
   
  webclientversion: FormGroup;

  constructor(
    public auth: AuthService,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user.email);
      } else {
        console.log("0");
      }
    });


  }


  signOutSuperAdmin() {
    this.auth.signOut;
  }

}
