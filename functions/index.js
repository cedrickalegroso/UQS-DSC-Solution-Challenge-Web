const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

var serviceAccount = require("./theuqspermission.json");

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
            console.log(serviceUid);
            let unixTimestamp = Math.floor(Date.now() / 100);
            let serviceColl = db.collection('services');
            let queryserviceColl = serviceColl.where('uid', '==', serviceUid).limit(1).get()
            .then( snapshot => {
               if (snapshot.empty) {
                  console.log("ERROR SERVICE NOT FOUND");
               } else {
                  snapshot.forEach(doc => {
                  serviceData = doc.data().abbreviation;
                  });
               }
               return true;
            });
            let ticketColl = db.collection('tickets');
            let queryticketColl = ticketColl.where('serviceUid', '==', 'PShgL9TBqdVIcvDJ4CBbHJs1U1F3').orderBy('ticketRaw', 'desc').limit(1).get()
            .then( snapshot => {
               if (snapshot.empty) {                
                  ticketColl.doc(`${ serviceData + 1 + unixTimestamp }`).set({
                     refNo: serviceData +  1 + unixTimestamp,
                     serviceUid: serviceUid,
                     ticketNo: serviceData + 1,
                     ticketRaw: 1,
                     ticketOwnerUid: ticketOwnner,
                     timestamp:  unixTimestamp,
                     teller: 0,
                     ticketStatus: 1
                   });                  
               } else {
                  snapshot.forEach(doc => {
                     data = doc.data();
                     let ticketRaw1 = data.ticketRaw + 1;
                     let refNo = serviceData + ticketRaw1 + unixTimestamp;
                     let ticketFinal = serviceData + ticketRaw1;
                     ticketColl.doc(`${refNo}`).set({
                        refNo: refNo,
                        serviceUid: serviceUid,
                        ticketNo: ticketFinal,
                        ticketRaw: ticketRaw1,  
                        ticketOwnerUid: ticketOwnner,
                        timestamp:  unixTimestamp,
                        teller: 0,
                        ticketStatus: 1
                   });
                   });
                }
                return true;
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


 // ticketDOne
app.post('/api/ticketdone:refNo', (req, res) => {
   (async() => {
      try{
         let ref;
         let unixTimestamp = Math.floor(Date.now() / 1000);
         let ticketColl = db.collection('tickets');
         let queryticketColl = ticketColl.where('refNo', '==', req.body.refNo).limit(1).get()
         .then( snapshot => {
             if(snapshot.empty){
               console.log("ERROR TICKET NOT FOUND");
             } else {
                snapshot.forEach(doc => {
                ref = doc.data().refNo;
                ticketColl.doc(`${ref}`).update({
                ticketStatus: 0,
                timestampDone: unixTimestamp
                });
                });
             }
             return true;
         });
         return res.status(200).send();
      } 
      catch(error)
      {
         console.log(error)
         return res.status(500).send(error);
      }
   });
});

 
// Read

// Update

// Delete


// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);