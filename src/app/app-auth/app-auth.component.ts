import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SuperadminService } from '../services/superadmin.service';
import * as firebase from 'firebase/app';
import { from } from 'rxjs'


@Component({
  selector: 'app-app-auth',
  templateUrl: './app-auth.component.html',
  styleUrls: ['./app-auth.component.scss']
})
export class AppAuthComponent implements OnInit {

  isHiddenSignIn = false;
  isHiddenRegister = true;

  registerFormGroup: FormGroup;
  loginFormGroup: FormGroup;

  constructor(
    public super$: SuperadminService,
    private _formBuilder: FormBuilder,
    private readonly afs: AngularFirestore,
    private afStorage: AngularFireStorage,

  ) { }

  ngOnInit() {



    // the register form group
    this.registerFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });


      // the login form group
      this.loginFormGroup = this._formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });



    this.showSignin();
  }

    
  showSignin(){
    this.isHiddenSignIn = false;
    this.isHiddenRegister = true

    let tabActive1 = document.getElementsByClassName('tabActive1') as HTMLCollectionOf<HTMLElement>;
      let tabActive2 = document.getElementsByClassName('tabActive2') as HTMLCollectionOf<HTMLElement>;

      if (tabActive1.length != 0) {
        tabActive1[0].style.color= "#4267B2";
      }

      if (tabActive2.length != 0) {
        tabActive2[0].style.color= "lightgrey";
      }


  }

  showReg(){
    this.isHiddenSignIn = true;
    this.isHiddenRegister = false;

    let tabActive1 = document.getElementsByClassName('tabActive1') as HTMLCollectionOf<HTMLElement>;
    let tabActive2 = document.getElementsByClassName('tabActive2') as HTMLCollectionOf<HTMLElement>;

    if (tabActive1.length != 0) {
      tabActive1[0].style.color= "lightgrey";
    }

    if (tabActive2.length != 0) {
      tabActive2[0].style.color= "#4267B2";
    }

 

  }


  tabActive(){
    let tabActive1 = document.getElementsByClassName('tabActive1') as HTMLCollectionOf<HTMLElement>;
    
    if (tabActive1.length != 0) {
      tabActive1[0].style.color= "blue";
    }

  }


  tryRegister(value){
    this.super$.SuperAdminSignup(value)
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    });
  }

  loginUser(value){
    this.super$.SuperAdminSignin(value)
    .then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    });
  }

 


}
