const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const hbs = require('nodemailer-express-handlebars');



//var emailTemp = require("./mail1.html");
var serviceAccount = require("./theuqspermission.json");
const config = functions.config().firebase

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://theuqs-52673.firebaseio.com",
   config: functions.config().firebase
});



var transporter = nodemailer.createTransport(smtpTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.pass
   }
}));


const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: true }));


// Cancel ticket
app.post('/api/NotifyUser:uid:refNo', (req, res) => {

   try {
      console.log('============ using updated api [Notify User] ================')
      console.log('====================  version APRIL 20   =======================')

      let refNo = req.body.refNo // returns ticket refno
      let user = req.body.uid // returns user
      let fcmData;
      let ticketData
      let userData;


      admin.firestore().collection('fcmTokens').doc(user).get().then((doc) => {
         fcmData = doc.data();
         return triggerNotitfyFCM(fcmData, refNo)

      })
         .catch(err => console.log(err))



      admin.firestore().collection('tickets').doc(refNo).get().then((doc) => {
         return doc.data()
      }).then((results) => {
         ticketData = results
         if (ticketData.isEmailNotify === 1) {
            console.log(ticketData)
            return triggerNotitfyEmail(user, ticketData)
         } else {
            console.log('ticket already notified')
         }
         return null
      })
         .catch(err => console.log(err))

      admin.firestore().collection('tickets').doc(refNo).update({
         alreadyNotified: 1
      })

      return res.status(200).send();

   }
   catch (error) {
      console.log(error)
      return res.status(500).send(error);
   }
});

function triggerNotitfyFCM(fcmData, refNo) {
   console.log('triggerNotitfyFCM')
   admin.firestore().collection('tickets').doc(refNo).get().then((doc) => {
      var payload = {
         notification: {
            body: 'Your ticket ' + doc.data().ticketNo + ' has reached your given trigger'
         }
      }
      admin.messaging().sendToDevice(fcmData.token, payload)
      return true;
   }).catch(err => console.log(err))


}

function triggerNotitfyEmail(user, ticketData) {
   console.log('triggerNotitfyEmail')
   admin.firestore().collection('userCollection').doc(user).get().then((doc) => {
      const handlebarOptions = {
         viewEngine: {
            extName: '.handlebars',
            partialsDir: './view/',
            layoutsDir: './view/trigger/',
         },
         viewPath: './view/trigger/',
         extName: '.handlebars',
      };
      transporter.use('compile', hbs(handlebarOptions))
      const mailOptions = {
         from: `"Theuqsteam", "<no-reply>"`,
         to: doc.data().email,
         subject: "BEEPP BOOP",
         template: 'trigger',
         context: {
            username: doc.data().name,
            ticket: ticketData.ticketNo,
         }
      };
      transporter.sendMail(mailOptions);
      return null
   }).catch(err => console.log(err))
}

function triggerNotitfySMS(userData, refNo) {

   console.log("Trigger SMS notify ");

}


// Cancel ticket
app.post('/api/CancelTicket:refNo', (req, res) => {

   try {
      console.log('============ using updated api [cancel ticket] ================')
      console.log('====================  version APRIL 3   =======================')

      let refNo = req.body.refNo // returns ticket refno
      let unixTimestamp = Math.floor(Date.now() / 100); // unixtimestamp
      let date = admin.firestore.Timestamp.now().toDate();

      admin.firestore().collection('tickets')
         .doc(refNo)
         .update({
            ticketStatus: 0
         })
         .then(() => {
            admin.firestore().doc(`tickets/${refNo}/timeline/${unixTimestamp}`)
               .set({
                  message: date + ' Ticket Canceled '
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


// Cancel ticket
app.post('/api/sendEmail', (req, res) => {

   try {
      console.log('============ using updated api [TEST TWILLIO] ================')
      console.log('====================  version APRIL 3   =======================')

      const sendMail = (callback) => {

         var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
               user: "theuqs@gmail.com",
               pass: "solution2019"
            }
         }));

         const handlebarOptions = {
            viewEngine: {
               extName: '.hbs',
               partialsDir: './view/',
               layoutsDir: './view/',
            },
            viewPath: './view/',
            extName: '.handlebars',
         };

         transporter.use('compile', hbs(handlebarOptions))


         const mailOptions = {
            from: `"Theuqsteam", ""`,
            to: `personal.dancedrick@gmail.com`,
            subject: "Ticket Created",
            template: 'index',
            context: {
               username: "Jacob",
            }
         };

         transporter.sendMail(mailOptions, callback);
      }



      sendMail((err, info) => {
         if (err) {
            console.log(err);
            res.status(400);
            res.send({ error: "Failed to send email" });
         } else {
            console.log("Email has been sent");
            res.send(info);
         }
      });

      return res.status(200).send()

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
         let response = timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});



// Find latest done ticket
app.get('/api/latestTicketDone/:sid', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [read timeline] ================')
         console.log('====================  version APRIL 5   =======================')
         let sid = req.params.sid // returns the service uid
         const document = admin.firestore().collection('tickets')
            .where('serviceUid', '==', sid)
            .where('ticketStatus', '==', 2)
            .orderBy('teller', 'asc')
            .limit(8)
         let ticket = await document.get()
         let response = ticket.docs.map(doc => doc.data());

         console.log(sid)
         console.log(response)

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
         let response = timeline.docs.map(doc => doc.data());

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
         let response = timeline.docs.map(doc => doc.data());

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
         let response = timeline.docs.map(doc => doc.data());

         console.log(response);

         return res.status(200).send(response)
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

      }
   })();
});



// new teller notify
app.post('/api/updateDisplayName:uid:displayName', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [Update DisplayName] ================')
         console.log('====================  version APRIL 17   =======================')
         let displayname = req.body.displayName
         let uid = req.body.uid

         admin.firestore().collection('userCollection').doc(uid).update({
            displayName: displayname
         });

         return res.status(200).send()
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)
      }
   })();
});


// new teller notify
app.post('/api/updatePhoneNumber:uid:phoneNumber', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [Update DisplayName] ================')
         console.log('====================  version APRIL 17   =======================')
         let phoneNumber = req.body.phoneNumber
         let uid = req.body.uid

         admin.firestore().collection('userCollection').doc(uid).update({
            phoneNumber: phoneNumber
         });

         return res.status(200).send()
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)
      }
   })();
});


// new teller notify
app.post('/api/updateprofilepic:uid:fileUrl', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [Update Profile Picture] ================')
         console.log('====================  version APRIL 17   =======================')
         let fileUrl = req.body.fileUrl
         let uid = req.body.uid

         admin.firestore().collection('userCollection').doc(uid).update({
            photoUrl: fileUrl
         });

         return res.status(200).send()
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)
      }
   })();
});






// new teller notify
app.post('/api/newTellerNotify:uid:teller', (req, res) => {
   (async () => {
      try {
         console.log('============ using updated api [Notify New teller] ================')
         console.log('====================  version APRIL 5   =======================')
         let teller = req.body.teller
         let uid = req.body.uid

         admin.firestore().collection('fcmTokens').doc(uid)
            .get().then((doc) => {
               var payload = {
                  notification: {
                     body: 'Teller ' + teller + ' is now your teller.'
                  }
               }
               admin.messaging().sendToDevice(doc.data().token, payload)
               return true;
            })
            .catch(err => console.log(err))


         return res.status(200).send()
      }
      catch (error) {
         console.log(error);
         return res.status(500).send(error)

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

      ServiceRef.get().then(function (doc) {
         if (doc.exists) {
            ServiceData = doc.data()
            return sendTicketEmail(ServiceData, ticket);
         } else {
            console.log("No such document!");
            return false;
         }
      }).catch(function (error) {
         console.log("Error getting document:", error);
      });

   });

function sendTicketEmail(ServiceData, ticket) {
   var UserRef = admin.firestore().collection("userCollection").doc(ticket.ticketOwnerUid);
   UserRef.get().then(function (doc) {
      if (doc.exists) {
         console.log(ServiceData.displayName)
         console.log(ticket.refNo)
         console.log(doc.data().email)
         console.log(ticket.isEmailNotify)
         console.log(ticket.trigger)
         console.log(ticket.timestamp)

         const handlebarOptions = {
            viewEngine: {
               extName: '.handlebars',
               partialsDir: './view/',
               layoutsDir: './view/ticket/',
            },
            viewPath: './view/ticket/',
            extName: '.handlebars',
         };

         transporter.use('compile', hbs(handlebarOptions))
         const mailOptions = {
            from: `"Theuqsteam", "<no-reply>"`,
            to: doc.data().email,
            subject: "Ticket Created",
            template: 'main',
            context: {
               displayName: ServiceData.displayName,
               abbre: ServiceData.abbreviation,
               ticketNo: ticket.ticketNo,
               timestamp: ticket.timestamp,
            }
         };
         transporter.sendMail(mailOptions);

         return true;

      } else {
         // doc.data() will be undefined in this case
         console.log("No such document!");
         return false;
      }
   }).catch(function (error) {
      console.log("Error getting document:", error);
   });



}

// Mock Data
app.post('/api/mock', (req, res) => {

   admin.firestore().collection('services').doc('X4TB4qodCcSeE8tG0SbRqSyEPpc2').set({
      'displayName': 'Banco De oro',
      'abbreviation': 'BDO',
      'uid': 'X4TB4qodCcSeE8tG0SbRqSyEPpc2'
   });


   admin.firestore().collection('userCollection').doc('Q3BtesHWliarX1Ig5G2elm0Qlda2').set({
      'name': 'Jacob',
      'email': 'personal.dancedrick@gmail.com',
      'uid': 'Q3BtesHWliarX1Ig5G2elm0Qlda2'
   });


   admin.firestore().collection('fcmTokens').doc('Q3BtesHWliarX1Ig5G2elm0Qlda2').set({
      'token': 'dj5QwyTiR-yTi1W9SngpxD:APA91bGDJR-c-2eN_sAyJ0dPH6n9_C02UzsU2QgHNBZZC0y9DxMA-4pNVuIVzTAevggacUq-_eqiMfOkXj8UTuOgAm9LQajwwX3YrMZ1EWj0KVdlzIWBUxled0FH65YnLiyFrPHM-AGS',
   });


   return res.status(200).send();

});



// Export the api to firebse Cloud Functions
exports.app = functions.https.onRequest(app);

