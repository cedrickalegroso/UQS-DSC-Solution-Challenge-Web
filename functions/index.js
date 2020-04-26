const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

<<<<<<< HEAD


//var emailTemp = require("./mail1.html");
=======
>>>>>>> 87e5d626e5f71eb8dacc5c690fa4b514fa363493
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



// Create Ticket
app.post('/api/creaticketNew:sid:uid:abb', (req, res) => {

   (async () => {


      try {
         console.log('=================== using updated api ========================')
         console.log('===================  version APRIL 2.1 ========================')

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
   })();
});

// Ticket DOne
app.post('/api/notifyNext:refNo', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [ticket Done] ================')
         console.log('====================  version APRIL 5   =======================')
         let refNo = req.body.refNo

         admin.firestore().collection('tickets').doc(refNo).get()
            .then((doc) => {
               return doc.data()
            }).then((results) => {
               console.log(results.ticketRaw)
               let target = results.ticketRaw + 1
               return remindNext(target, sid)
            })
            .catch(err => console.log(err))

            admin.firestore().collection("tickets").doc(ticket.refNo).collection('timeline').doc(unixTimestamp).set({
               message: unixTimestamp + " Ticket " + refNo + " done. "
            });

         return res.status(200).send()
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});

function remindNext(target, sid) {
   console.log('reminding next');
   admin.firestore().collection('tickets').where('ticketRaw', '==', target)
      .where('serviceUid', '==', sid).get()
      .then((snapshot) => {
         snapshot.forEach((doc) => {
            let next = doc.data()
            return messageNext(fifth)
         })
         return true;
      })
      .catch(err => console.log(err))
}

function messageNext(next) {
   admin.firestore().collection('fcmTokens').doc(next.ticketOwnerUid).get()
      .then((doc) => {
         var payload = {
            notification: {
               body: 'Your Ticket ' + next.ticketNo + ' is next in-line'
            }
         }
         admin.messaging().sendToDevice(doc.data().token, payload)
         return true;
      })
      .catch(err => console.log(err))

   admin.firestore().collection('userCollection').doc(next.ticketOwnerUid).get()
      .then((doc) => {
         const handlebarOptions = {
            viewEngine: {
               extName: '.handlebars',
               partialsDir: './view/',
               layoutsDir: './view/next/',
            },
            viewPath: './view/next/',
            extName: '.handlebars',
         };

         transporter.use('compile', hbs(handlebarOptions))

         const mailOptions = {
            from: `"Theuqsteam", "<no-reply>"`,
            to: doc.data().email,
            subject: "You are next",
            template: 'next',
            context: {
               username: user.name,
               ticket: next.ticketNo,
            }
         };
         transporter.sendMail(mailOptions);
         return true
      })
      .catch(err => console.log(err))
}


exports.createUser = functions.firestore
   .document('userCollection/{userId}')
   .onCreate((snap, context) => {
      console.log('============ triggered Welcome user  ================')
      const newValue = snap.data();
      const user = newValue;

      const handlebarOptions = {
         viewEngine: {
            extName: '.handlebars',
            partialsDir: './view/',
            layoutsDir: './view/welcome/',
         },
         viewPath: './view/welcome/',
         extName: '.handlebars',
      };
      transporter.use('compile', hbs(handlebarOptions))
      const mailOptions = {
         from: `"Theuqsteam", "<no-reply>"`,
         to: user.email,
         subject: "Welcome",
         template: 'welcome',
         context: {
            username: user.name,
         }
      };
      transporter.sendMail(mailOptions);
   });



exports.ticketCreated = functions.firestore
   .document('tickets/{ticketId}')
   .onCreate((snap, context) => {
      console.log('============ triggered ticket created  ================')
      const newValue = snap.data();
      const ticket = newValue;

      let unixTimestamp = Math.floor(Date.now() / 100); // unixtimestamp

      var ServiceData;

      var ServiceRef = admin.firestore().collection("services").doc(ticket.serviceUid);

      var FcmRef = admin.firestore().collection("fcmTokens").doc(ticket.ticketOwnerUid);

      admin.firestore().collection("tickets").doc(ticket.refNo).collection('timeline').doc(unixTimestamp).set({
         message: unixTimestamp + " Ticket " + ticket.ticketNo + " created. "
      });

      FcmRef.get().then(function (doc) {
         if (doc.exists) {
            var payload = {
               notification: {
                  body: 'Your ticket ' + ticket.ticketNo + ' has been created'
               }
            }
            admin.messaging().sendToDevice(doc.data().token, payload)
            return true;
         } else {
            console.log("No such document!");
            return false;
         }
      }).catch(function (error) {
         console.log("Error getting document:", error);
      });


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
