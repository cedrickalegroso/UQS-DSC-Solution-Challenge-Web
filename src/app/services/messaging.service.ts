/*
import { Injectable } from '@angular/core';


import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging) { 
    
      this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      });
   }

   reuestPermission() {
     this.angularFireMessaging.requestToken.subscribe((token) => {
     console.log(token)
     }, err => {
     console.error('Unable to get permission to notify.', err)
     });
   }

   recieveMessage() {
     this.angularFireMessaging.messages.subscribe((payload) => {
     console.log('New message recieved. ', payload);
     this.currentMessage.next(payload);
     });
   }
}
 */