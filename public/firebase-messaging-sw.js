importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBZKj2TXF1S12liuUSV7uILNqqzq1jnQlc",
  authDomain: "circle-ci-test-31dfc.firebaseapp.com",
  databaseURL: "https://circle-ci-test-31dfc.firebaseio.com",
  projectId: "circle-ci-test-31dfc",
  storageBucket: "circle-ci-test-31dfc.appspot.com",
  messagingSenderId: "350049236638"
});
const messaging = firebase.messaging();// start service worker
messaging.setBackgroundMessageHandler(payload => {
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  return self.registration.showNotification(title, options);
});
