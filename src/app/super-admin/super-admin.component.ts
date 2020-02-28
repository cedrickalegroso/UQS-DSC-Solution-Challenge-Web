import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SuperadminService } from '../services/superadmin.service';
import * as firebase from 'firebase/app';
import { SystemService } from '../services/system.service';
import { from, BehaviorSubject } from 'rxjs';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
   
  versionCOntrolSystem: FormGroup;
  updateForm: FormGroup;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(
    private super$: SuperadminService,
    private version$: SystemService,
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
   
       // the login form group
       this.versionCOntrolSystem = this._formBuilder.group({
        versionNo: ['', Validators.required],
        description: ['', Validators.required],
      });



  }


  signOutSuperAdmin() {
   // this.super$.signOut;
  }

  updateDefClick(value){
   this.version$.VersioncontrolUpdate(value)
   .then( res=> {
     console.log(res);
   }, err => {
     console.log(err);
   })
  }

}
