import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCW40112DBUJ5Z4mQLSj0XoRWP0brIOn_g",
  authDomain: "attendanceapp-3d480.firebaseapp.com",
  databaseURL: "https://attendanceapp-3d480.firebaseio.com",
  projectId: "attendanceapp-3d480",
  storageBucket: "attendanceapp-3d480.appspot.com",
  messagingSenderId: "528032982018"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }


  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}

export default Firebase;