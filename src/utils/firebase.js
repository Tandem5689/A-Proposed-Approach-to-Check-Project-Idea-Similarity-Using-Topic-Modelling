import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase1 from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyAnuqvRtfivecnt7iSVDv56RV1pXKLapik",
  authDomain: "fyp-djsce.firebaseapp.com",
  projectId: "fyp-djsce",
  storageBucket: "fyp-djsce.appspot.com",
  messagingSenderId: "917409434549",
  appId: "1:917409434549:web:a327e88cab7a662e22a7fc",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export  {app,db};
