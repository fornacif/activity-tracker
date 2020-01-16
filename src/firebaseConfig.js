import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// firebase init goes here
const config = {
    apiKey: "AIzaSyA9Khq6Z5QIAqRbn_7w7k068Wm-0UqtDLY",
    authDomain: "localhost:8081",
    databaseURL: "https://activity-tracker-4eef6.firebaseio.com",
    projectId: "activity-tracker-4eef6"
}
firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();
const activitiesCollection = firestore.collection('activities');

export {
    firestore,
    auth,
    activitiesCollection
}