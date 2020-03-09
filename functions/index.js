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


// email
let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: 'theuqs@gmail.com',
       pass: 'solution2019'
   }
});

exports.sendMail = functions.https.onRequest((req, res) => {
   cors(req, res, () => {
     
       // getting dest email by query string
       const dest = req.query.dest;

       const mailOptions = {
           from: 'Your Account Name <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
           to: dest,
           subject: 'I\'M A PICKLE!!!', // email subject
           html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
               <br />
               <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
           ` // email content in HTML
       };
 
       // returning result
       return transporter.sendMail(mailOptions, (erro, info) => {
           if(erro){
               return res.send(erro.toString());
           }
           return res.send('Sended');
       });
   });    
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
                     refNo:  1 + unixTimestamp,
                     serviceUid: serviceUid,
                     ticketNo: serviceData + 1,
                     ticketRaw: 1,
                     ticketOwnerUid: ticketOwnner,
                     timestamp:  unixTimestamp,
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