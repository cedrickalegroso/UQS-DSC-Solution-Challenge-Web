const functions = require('firebase-functions');
const admin = require('firebase-admin');
const afs = require('@angular/fire/firestore');


var serviceAccount = require("../functions/theuqspermission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://theuqs-52673.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();


const cors = require('cors');
app.use( cors( {origin: true }));


// Routes
app.get('/hello-world', (req, res) => {
   return res.status(200).send('Hello World!');
});


// Create 
app.post('/api/createTicket:sid:uid', (req, res) => {
    
    (async() => {
            
          try
          {
            let data;
            let serviceData;
            let serviceUid = req.body.sid;
            let ticketOwnner = req.body.uid;
            let unixTimestamp = Math.floor(Date.now() / 100);
            let serviceColl = db.collection('services', ref => ref.where('uid', '==', serviceUid).limit(1));
            let ticketColl = db.collection('tickets');
            let queryticketColl = ticketColl.where('serviceUid', '==', 'PShgL9TBqdVIcvDJ4CBbHJs1U1F3').orderBy('ticketRaw', 'desc').limit(1).get()
            .then( snapshot => {
   
               if (snapshot.empty) {
                  
                  ticketColl.doc(`${  + 1 + unixTimestamp }`).set({
                     refNo:  1 + unixTimestamp,
                     serviceUid: serviceUid,
                     ticketNo: "ADM" + 1,
                     ticketRaw: 1,
                     ticketOwnerUid: ticketOwnner,
                     timestamp:  unixTimestamp
                   });

                   
               } else {

                  snapshot.forEach(doc => {
                     data = doc.data();

                     let ticketRaw1 = data.ticketRaw + 1;
                     let refNo ="ADM" + ticketRaw1 + unixTimestamp;
                     let ticketFinal = "ADM" + ticketRaw1;
                     ticketColl.doc(`${refNo}`).set({
                        refNo: refNo,
                        serviceUid: serviceUid,
                        ticketNo: ticketFinal,
                        ticketRaw: ticketRaw1,  
                        ticketOwnerUid: ticketOwnner,
                        timestamp:  unixTimestamp
                   });
                   });
                }
            });
             
            return res.status(200).send();

          }
          catch (error)
          {

             console.log(error)
             return res.status(500).send(error);    

          }
          
    })();
 });

 
// Read

// Update

// Delete


// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);