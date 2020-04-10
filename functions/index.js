const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const nodemailer = require('nodemailer');

var serviceAccount = require("./theuqspermission.json");
const config = functions.config().firebase

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://theuqs-52673.firebaseio.com",
   config: config
});



const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: true }));


// Cancel ticket
app.post('/api/CancelTicket:refNo',  (req, res) => {
   
   try {
      console.log('============ using updated api [cancel ticket] ================')
      console.log('====================  version APRIL 3   =======================')

      let refNo = req.body.refNo // returns ticket refno
      let unixTimestamp = Math.floor(Date.now() / 100); // unixtimestamp

      admin.firestore().collection('tickets')
         .doc(refNo)
         .update({
            ticketStatus: 0
         })
         .then(() => {
            admin.firestore().doc(`tickets/${refNo}/timeline/${unixTimestamp}`)
               .set({
                  message: 'Ticket Canceled'
               })
            return res.status(200).send();
         })
         .catch(err => console.log(err))



   }
   catch (error) {
      console.log(error)
      return res.status(500).send(error);
   }
});


// Read Timeline
app.get('/api/timeline/:refNo', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [read timeline] ================')
         console.log('====================  version APRIL 5   =======================')
         let refNo = req.params.refNo // returns the service uid
         const document = admin.firestore().collection('tickets').doc(refNo)
         .collection('timeline')
         let timeline = await document.get()
         let response =  timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});


// Get univ service
app.get('/api/getUniversity/', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [get services] ================')
         console.log('====================  version APRIL 9   =======================')
         const document = admin.firestore().collection('services').where('categoryIndex', '==', 0)
         let timeline = await document.get()
         let response =  timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});


// Get univ service
app.get('/api/getBanks/', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [get services] ================')
         console.log('====================  version APRIL 9   =======================')
         const document = admin.firestore().collection('services').where('categoryIndex', '==', 2)
         let timeline = await document.get()
         let response =  timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});



// Get univ service
app.get('/api/getGovernment/', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [get services] ================')
         console.log('====================  version APRIL 9   =======================')
         const document = admin.firestore().collection('services').where('categoryIndex', '==', 1)
         let timeline = await document.get()
         let response =  timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});




// Create Ticket
app.post('/api/creaticketNew:sid:uid:abb', (req, res) => {
   try {
      console.log('============ using updated api [create ticket] ================')
      console.log('====================  version APRIL 3   =======================')

      let serviceUid = req.body.sid // returns the service uid
      let ticketOwnner = req.body.uid // returns the user uid
      let unixTimestamp = Math.floor(Date.now() / 100);

      admin.firestore().collection('tickets')
         .where('serviceUid', '==', serviceUid)
         .where('ticketOwnerUid', '==', ticketOwnner)
         .where('ticketStatus', '==', 1)
         .get()
         .then((snapshot) => {
            if (!snapshot.empty) {
               console.log('reject ticket')
               return err(ticketOwnner)
            } else {
               console.log('accpet ticket')
               return test(serviceUid, ticketOwnner, unixTimestamp)
            }

         })
         .catch(err => console.log(err))



      return res.status(200).send();
   }
   catch (error) {
      console.log(error)
      return res.status(500).send(error);
   }

});


function ErrMessage(ticketOwnner) {
   console.log(ticketOwnner)
}

function err(ticketOwnner) {
   admin.firestore().collection('fcmTokens').doc(ticketOwnner)
      .get()
      .then(doc => {
         return doc.data()
      })
      .then(results => {
         var payload = {
            notification: {
               title: 'Success',
               body: 'Error you have an existing ticket'
            }
         }

         admin.messaging().sendToDevice(results.token, payload)
         return true;
      })
      .catch(err => console.log(err))
}

function test(serviceUid, ticketOwnner, unixTimestamp) {
   admin.firestore().collection('services').doc(serviceUid)
      .update({
         ticketCount: FieldValue.increment(1)
      })
   admin.firestore().collection('services').doc(serviceUid)
      .get()
      .then(doc => {
         return doc.data()
      })
      .then(results => {
         let ticketNo = results.ticketCount + 1
         let refNo = results.abbreviation + ticketNo + unixTimestamp
         admin.firestore().collection('tickets').doc(`${refNo}`).set({
            refNo: results.abbreviation + ticketNo + unixTimestamp,
            serviceUid: results.uid,
            ticketNo: results.abbreviation + ticketNo,
            ticketRaw: ticketNo,
            ticketOwnerUid: ticketOwnner,
            timestamp: unixTimestamp,
            teller: 0,
            ticketStatus: 1
         })
         return refNo;
      })
      .then(results => {
         let date = admin.firestore.Timestamp.now().toDate();
         admin.firestore().doc(`tickets/${results}/timeline/${unixTimestamp}`)
            .set({
               message: date + ' Ticket created'
            })
         return;
      })
      .catch(err => console.log(err))

   admin.firestore().collection('fcmTokens').doc(ticketOwnner)
      .get()
      .then(doc => {
         return doc.data()
      })
      .then(results => {
         var payload = {
            notification: {
               title: 'Success',
               body: 'Ticket created successfuly'
            }
         }

         admin.messaging().sendToDevice(results.token, payload)
         return true;
      })
      .catch(err => console.log(err))
}




// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);

