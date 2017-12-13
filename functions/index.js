const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
// const bucket = admin.storage().bucket();
// for(let key in bucket) {
//           console.log('key: ', key);
//           console.log('value: ', bucket[key]);
//         }
//-------------------------- firestore -----------------------------------
exports.fsSendcreate = functions.firestore.document('/cources/{courceID}')
  .onCreate(cource => {
    const newValue = cource.data.data();
    const payload = {
      notification: {
        title: 'Circle CI test',
        body: `cource ${newValue.title} successfully added!`,
        icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
      }
    };
    console.log('-----------------------------------------');
    console.log(`cource ${newValue.title} successfully added!`);
    
    admin.firestore().collection('users').get()
      .then(snap => snap.docs)
      .then(docs => docs.map(doc => doc.data()))
      .then(users => users.filter(user => !!user.token))
      .then(users => users.map(user => {
          console.log(`sending message to user: ${user.uid}`);
          admin.messaging().sendToDevice(user.token, payload);
      }))
      .then(x => console.log('-----------------------------------------'));
    return false;
  });

exports.fsSenddelete = functions.firestore.document('/cources/{courceID}')
.onDelete(cource => {
  const previousValue = cource.data.previous.data();
  const payload = {
    notification: {
      title: 'Circle CI test',
      body: `cource ${previousValue.title} successfully deleted!`,
      icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
    }
  };
  console.log('-----------------------------------------');
  console.log(`cource ${previousValue.title} successfully deleted!`);
  
  admin.firestore().collection('users').get()
    .then(snap => snap.docs)
    .then(docs => docs.map(doc => doc.data()))
    .then(users => users.filter(user => !!user.token))
    .then(users => users.map(user => {
        console.log(`sending message to user: ${user.uid}`);
        admin.messaging().sendToDevice(user.token, payload);
    }))
    .then(x => console.log('-----------------------------------------'));
  return false;
});
