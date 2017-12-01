const functions = require('firebase-functions');

exports.detectMeaging = functions.firestore
  .document('FCMMessaging/{user.uid}').onUpdate(event => {
    
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//∫unctionaλ
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
