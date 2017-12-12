const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const currentId
// console.log(functions.config());
admin.initializeApp(functions.config().firebase);

// const currentUser = {};

// exports storeCurrentUserID = functions.firestore.document('FCMMesaging/{newId}')
//   .onCreate(user => {
//     console.log(user);
//     currentUser = user;
//   });

exports.fcmSendcreate = functions.database.ref('cources/{generatedId}')
  .onCreate(cource => {
    console.log(JSON.stringify(cource));
    // const message = event.data.val();
    // const userId = event.params.userId;
    const payload = {
      notification: {
        title: 'adding new cource.',
        body: 'new cource successfully added!'
        // icon:
      }
    };

    // admin.messaging().sendToDevice(currentUser., payload);
    //   .then(res => console.log('sent successfully', res))
    //   .catch(err => console.log(err));
    // admin.database().ref('FCMMesaging/').once('value')
    //   .then(token => console.log(token))
    //   .then(userFcmToken => {
    //     console.log(userFcmToken);
    //     admin.messaging().sendToDevice(userFcmToken, payload);
    //   })
  });

  exports.fcmSendupdate = functions.database.ref('cources')
  .onUpdate(cource => {
    console.log(JSON.stringify(cource));
    // const message = event.data.val();
    // const userId = event.params.userId;
    const payload = {
      notification: {
        title: 'adding new cource.',
        body: 'new cource successfully added!'
        // icon:
      }
    };

    // admin.messaging().sendToDevice(currentUser., payload);
    //   .then(res => console.log('sent successfully', res))
    //   .catch(err => console.log(err));
    // admin.database().ref('FCMMesaging/').once('value')
    //   .then(token => console.log(token))
    //   .then(userFcmToken => {
    //     console.log(userFcmToken);
    //     admin.messaging().sendToDevice(userFcmToken, payload);
    //   })
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//∫unctionaλ
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// firebase.apiKey="AIzaSyBZKj2TXF1S12liuUSV7uILNqqzq1jnQlc" firebase.authDomain="circle-ci-test-31dfc.firebaseapp.com" firebase.databaseURL="https://circle-ci-test-31dfc.firebaseio.com" firebase.projectId="circle-ci-test-31dfc" firebase.storageBucket="circle-ci-test-31dfc.appspot.com" firebase.messagingSenderId="350049236638"