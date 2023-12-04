import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCgZhcL2ou2jjh3xhJiCZDLD1Wo2wjrVKQ',
  authDomain: 'projetannuel-309416.firebaseapp.com',
  projectId: 'projetannuel-309416',
  storageBucket: 'projetannuel-309416.appspot.com',
  messagingSenderId: '1007446631717',
  appId: '1:1007446631717:web:39ebf1d1a4a3807020e6cc',
  measurementId: 'G-P9Z20DBBBJ',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
