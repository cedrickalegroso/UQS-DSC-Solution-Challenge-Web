/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
app.post('/api/CancelTicket:refNo', async (req, res) => {


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



function rejectTicket(ticketOwnner) {

   

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
         .then(function (response) {
            console.log("Successfully sent message:", response);
            console.log(response.results[0].error);
            return;
         })
         .catch(function (error) {
            console.log("Error sending message:", error);
            return res.status(500).send();
         });
      return;
   })
   .catch(err => console.log(err))
}



function createTicket(serviceUid, ticketOwnner) {

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
         admin.firestore().doc(`tickets/${results}/timeline/${unixTimestamp}`)
            .set({
               message: unixTimestamp + ' Ticket created'
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
            .then(function (response) {
               console.log("Successfully sent message:", response);
               console.log(response.results[0].error);
               return;
            })
            .catch(function (error) {
               console.log("Error sending message:", error);
               return res.status(500).send();
            });
         return;
      })
      .catch(err => console.log(err))

}



// Create Ticket
app.post('/api/creaticketNew:sid:uid:abb', (req, res) => {

   (async () => {

      try {
         console.log('============ using updated api [create ticket] ================')
         console.log('====================  version APRIL 3   =======================')

         let abbreviation = req.body.abb // returns service abb
         let serviceUid = req.body.sid // returns the service uid
         let ticketOwnner = req.body.uid // returns the user uid



         admin.firestore().collection('tickets')
            .where('serviceUid', '==', serviceUid)
            .where('ticketOwnerUid', '==', ticketOwnner)
            .where('ticketStatus', '==', 1)
            .get()
            .then(snapshot => {
               if (snapshot.empty) {
                  console.log('no ticket found for this user ' + ticketOwnner)
                  return getserviceData(serviceUid, ticketOwnner);
               } else {
                  console.log('this user already have a ticket')
                  message = "Error you already have a existing ticket to this service"
                  return prepareMessage(message);
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
});



async function getserviceData(serviceUid, ticketOwnner) {
   console.log('getserviceData triggreed')
   admin.firestore().collection('services')
      .where('uid', '==', serviceUid)
      .limit(1)
      .get()
      .then(snapshot => {
         if (snapshot.empty) {
            message = "Error service not found"
            return prepareMessage(message)
         } else {
            snapshot.forEach(doc => {
               console.log('got service data sending it to intialize')
               serviceData = doc.data();
               let ticketNo = serviceData.ticketCount + 1;
               admin.firestore().collection('services').doc(`${serviceUid}`).update({
                  ticketCount: ticketNo
               });
               console.log('got service data sending it to intialize ' + ticketOwnner)
               return intializeTicket(ticketNo, serviceData, ticketOwnner)
            });
         }
         return;
      })
      .catch(err => console.log(err))
}

async function intializeTicket(ticketNo, serviceData, ticketOwnner) {
   let unixTimestamp = Math.floor(Date.now() / 100); // unixtimestamp
   console.log('initializing ticket')
   console.log('creating ticket')
   admin.firestore().collection('tickets')
      .doc(`${serviceData.abbreviation + ticketNo + unixTimestamp}`).set({
         refNo: serviceData.abbreviation + ticketNo + unixTimestamp,
         serviceUid: serviceData.uid,
         ticketNo: serviceData.abbreviation + ticketNo,
         ticketRaw: ticketNo,
         ticketOwnerUid: ticketOwnner,
         timestamp: unixTimestamp,
         teller: 0,
         ticketStatus: 1
      });
   message = "Ticket created successfully"
   return prepareMessage(message, ticketOwnner);
}


async function prepareMessage(message, ticketOwnner) {
   console.log('preparing success message ' + ticketOwnner)
   admin.firestore().collection('fcmTokens')
      .where('userUid', '==', ticketOwnner)
      .get()
      .then(snapshot => {
         snapshot.forEach(doc => {
            registrationToken = doc.data().token
         })
         return sendMessage(registrationToken, message)
      })
      .catch(err => console.log(err))
}




async function sendMessage(registrationToken, message) {
   console.log('token is ' + registrationToken)
   console.log('message is ' + message)
   var payload = {
      notification: {
         title: 'Success',
         body: message
      }
   };

   admin.messaging().sendToDevice(registrationToken, payload)
      .then(function (response) {
         console.log("Successfully sent message:", response);
         console.log(response.results[0].error);
         return;
      })
      .catch(function (error) {
         console.log("Error sending message:", error);
         return res.status(500).send();
      });

}



// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);

*/