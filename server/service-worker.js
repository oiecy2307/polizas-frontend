/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/4.4.0/firebase.js');
const config = {
  apiKey: 'AIzaSyAG7ZgehdL2vQKVxAmfVWUilDFKr2eHAzw',
  authDomain: 'suppdesk-271403.firebaseapp.com',
  databaseURL: 'https://suppdesk-271403.firebaseio.com',
  projectId: 'suppdesk-271403',
  storageBucket: 'suppdesk-271403.appspot.com',
  messagingSenderId: '870477871428',
  appId: '1:870477871428:web:6b1a05c0e7b1f60e16bf11',
  measurementId: 'G-P896WEF7C6',
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
const promiseChain = clients.matchAll({
  type: 'window',
  includeUncontrolled: true
})
.then((windowClients) => {
  for (let i = 0; i < windowClients.length; i++) {
    const windowClient = windowClients[i];
    windowClient.postMessage(payload.data);
  }
});
return promiseChain;
});
