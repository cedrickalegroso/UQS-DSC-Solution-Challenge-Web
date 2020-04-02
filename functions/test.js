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


//Sendgrid Config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 587,
   secure: false,
   requireTLS: true,
  auth: {
    user: 'theuqs@gmail.com',
    pass: 'solution2019',
  },
});

exports.sendNewTicketEmail = functions.firestore
   .document('tickets/{tickets}')
   .onCreate(async (snap, context) => {


      admin.firestore().collection('userCollection')
         .doc(snap.data().ticketOwnerUid)
         .get()
         .then(doc => {
            const user = doc.data()
            return getTicketData(user)
         })
         .catch(err => console.log(err))

      function getTicketData(user) {
         admin.firestore().collection('tickets')
            .doc(snap.data().refNo)
            .get()
            .then(doc => {
               const ticket = doc.data()
               return getserviceData(user, ticket)
            })
            .catch(err => console.log(err))
      }

      function getserviceData(user, ticket) {
         admin.firestore().collection('services')
            .doc(snap.data().serviceUid)
            .get()
            .then(doc => {
               const service = doc.data()
               return sendEmail(user, ticket, service)
            })
            .catch(err => console.log(err))
      }

      function sendEmail(user, ticket, service) {
         const mailOptions = {
            from: '"Theuqsteam" <Theuqsteam@firebase.com>',
            to: 'pandapewds11@gmail.com',
          };

          mailOptions.subject = "Ticket Created";
          mailOptions.text = "Hi you just created a ticket"

         
          mailTransport.sendMail(mailOptions)
          .then( function (response) {
             console.log('email sent to ' + user.email)
             console.log(response.results[0].error);
             return true
          })
          .catch(function (error) {
            console.log("Error sending message:", error);
            return null
         });

          
      }

   });


// Create Ticket
app.post('/api/creaticketNew:sid:uid:abb', (req, res) => {

   (async () => {

      try {
         console.log('=================== using updated api ========================')
         console.log('===================  version March 31 ========================')
         let serviceData;
         let abbreviation = req.body.abb // returns service abb
         let serviceUid = req.body.sid // returns the service uid
         let ticketOwnner = req.body.uid // returns the user uid
         let registrationToken // global


         admin.firestore().collection('tickets')
            .where('serviceUid', '==', serviceUid)
            .where('ticketOwnerUid', '==', ticketOwnner)
            .where('ticketStatus', '==', 1)
            .get()
            .then(snapshot => {
               if (snapshot.empty) {
                  console.log('no ticket found for this user')
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
   })();
});


function getserviceData(serviceUid, ticketOwnner) {
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
               return ticketNo, serviceData, ticketOwnner
            });
         }
         return;
      })
      .catch(err => console.log(err))
}

function intializeTicket(ticketNo, serviceData, ticketOwnner) {
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


function prepareMessage(message, ticketOwnner) {
   console.log('preparing success message')
   admin.firestore().collection('fcmTokens')
      .where('userUid', '==', ticketOwnner)
      .get()
      .then(snapshot => {
         console.log('got registration token')
         snapshot.forEach(doc => {
            registrationToken = doc.data().token;
            return sendMessage(registrationToken, message)
         })
         return;
      })
      .catch(err => console.log(err))
}


function sendMessage(registrationToken, message) {
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




// Read

// Update

// Delete


// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);
