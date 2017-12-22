const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
// const bucket = admin.storage().bucket();
// for(let key in bucket) {
//           console.log('key: ', key);
//           console.log('value: ', bucket[key]);
//         }
//-------------------------- debug -----------------------------------
// exports.debug = admin.firestore().collection('/debug').get()
//   .then(x => {
//     for (let key in cource) {
//       console.log(cource[key], key);
//     }
// });
//-------------------------- set id for cources -----------------------------------
exports.setCourceId = functions.firestore.document('/cources/{courceID}')
  .onCreate(cource => {
    const newValue = cource.data.data();
    newValue.id = cource.data.id;
    newValue.created = new Date;
    // console.log('-----------------------------------------');
    // console.log(`cource ${newValue.title} successfully added!`);
    // console.log('-----------------------------------------');
    return admin.firestore().collection('cources').doc(`${newValue.id}`).set(newValue);
  });

//-------------------------- messaging -----------------------------------
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

exports.fsSendupdate = functions.firestore.document('/cources/{courceID}')
.onUpdate(cource => {
  const previousValue = cource.data.previous.data();
  const payload = {
    notification: {
      title: 'Circle CI test',
      body: `cource ${previousValue.title} successfully updated!`,
      icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
    }
  };
  console.log('-----------------------------------------');
  console.log(`cource ${previousValue.title} successfully updated!`);
  
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

//-------------------------- authentication -----------------------------------

exports.sendWelcomeMsg = functions.auth.user().onCreate(event => {
  const user = event.data; // The Firebase user.
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  const token = user.token;
  const payload = {
      notification: {
        title: 'Circle CI test',
        body: `Welcome ${displayName}!`,
        icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
      }
    };
  admin.messaging().sendToDevice(token, payload);
});

exports.sendByeMsg = functions.auth.user().onDelete(event => { });

//-------------------------- backup -----------------------------------

exports.backupCources = functions.https.onRequest((req, res) => {
  admin.firestore().collection('backup_cources').get()
    .then(snap => snap.docs)
    .then(docs => docs.map(doc => doc.data()))
    .then(docs => docs.map(doc => 
      admin.firestore().collection('backup_cources').doc(doc.id).delete()))
    .then(docs => admin.firestore().collection('cources').get())
    .then(snap => snap.docs)
    .then(docs => docs.map(doc => doc.data()))
    .then(cources => cources.map(cource => 
        admin.firestore().collection('backup_cources').doc(`${cource.id}`).set(cource)))
    .then(backup => {
      console.log(`backuped ${backup.length} cources. Backup success!!`);
      res.send(`backuped ${backup.length} cources. Backup success!!`);
      return backup;
    })
    .then(backup => {
      const payload = {
        notification: {
          title: 'Circle CI test',
          body: `backuped ${backup.length} cources. Backup success!!`,
          icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
        }
      };
      admin.firestore().collection('users').get()
        .then(snap => snap.docs)
        .then(docs => docs.map(doc => doc.data()))
        .then(users => users.filter(user => !!user.token))
        .then(users => users.map(user => {
            console.log(`sending message to user: ${user.uid}`);
            admin.messaging().sendToDevice(user.token, payload);
        }))
    })
});

exports.restoreCources = functions.https.onRequest((req, res) => {
  admin.firestore().collection('cources').get()
    .then(snap => snap.docs)
    .then(docs => docs.map(doc => doc.data()))
    .then(docs => docs.map(doc => 
      admin.firestore().collection('cources').doc(doc.id).delete()))
    .then(docs => admin.firestore().collection('backup_cources').get())
    .then(snap => snap.docs)
    .then(docs => docs.map(doc => doc.data()))
    .then(backups => backups.map(bcource => 
        admin.firestore().collection('cources').doc(`${bcource.id}`).set(bcource)))
    .then(cources => {
      console.log(`restored ${cources.length} cources. Restore success!!`);
      res.send(`restored ${cources.length} cources. Restore success!!`);
      return cources;
    })
    .then(cources => {
      const payload = {
        notification: {
          title: 'Circle CI test',
          body: `restored ${cources.length} cources. Restore success!!`,
          icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
        }
      };
      admin.firestore().collection('users').get()
        .then(snap => snap.docs)
        .then(docs => docs.map(doc => doc.data()))
        .then(users => users.filter(user => !!user.token))
        .then(users => users.map(user => {
            console.log(`sending message to user: ${user.uid}`);
            admin.messaging().sendToDevice(user.token, payload);
        }))
    })
});