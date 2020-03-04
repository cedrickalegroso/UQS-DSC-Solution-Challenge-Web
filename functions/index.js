const functions = require('firebase-functions');
const admin = require('firebase-admin');

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
app.post('/api/createTicket', (req, res) => {
    
    (async() => {
            
          try
          {

             await db.collection('products').doc('/' + req.body.id + '/')
             .create({
                 name: req.body.name,
                 description: req.body.description,
                 price: req.body.price
             })

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