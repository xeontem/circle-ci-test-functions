const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
// const bucket = admin.storage().bucket();
// for(let key in bucket) {
//           console.log('key: ', key);
//           console.log('value: ', bucket[key]);
//         }
//-------------------------- firestore -----------------------------------
exports.fsSendcreate = functions.firestore.document('/cources/{generatedId}')
  .onCreate(cource => {
    // console.log(JSON.stringify(cource));

    // var newValue = cource.data.data();
    // console.log(JSON.stringify(newValue));

    // var previousValue = cource.data.previous ? cource.data.previous.data() : cource.data.previous;
    // console.log(JSON.stringify(previousValue));
    // console.log(cource.params);// what in curly brackets in .document method arguments
    const payload = {
      notification: {
        title: 'adding new cource.',
        body: `cource ${cource.title} successfully added!`
        // icon:
      }
    };
    // functions.firestore.document('/FCMMessaging/{uid}')
    // admin.database().ref('/users').once('value').then(obj => {
      admin.firestore().collection('users').get()
        .then(obj => obj.docs)
        .then(docs => docs.map(ref => {
          if(ref._fieldsProto.token) {
            const token = ref._fieldsProto.token.stringValue
            admin.messaging().sendToDevice(token, payload)
          }
        }))
        // console.log('-----------------------------------------');
        // docs.map(ref => {
        //   console.log(ref._fieldsProto.token && ref._fieldsProto.token.stringValue);
        // })
        // for(let key in obj.docs) {
        //   console.log('key: ', key);
        //   console.log('value: ', obj.docs[key]);
        // }
        // console.log('-----------------------------------------');
        
      // })
    // });
    // admin.database().ref('/FCMMessaging/').once('value')
      // .then(obj => {
      //   console.log(obj.val());
      //   token.val()
      // })
      // .then(userFcmToken => {
      // });
      return false;
  });
