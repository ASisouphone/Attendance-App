import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  //place key from firebase api here
  apiKey: "AIzaSyARCwgVKBLNPwgPGaE1LTYbJdOxcoWWIFk",
  authDomain: "gvsu-attendence.firebaseapp.com",
  databaseURL: "https://gvsu-attendence.firebaseio.com",
  projectId: "gvsu-attendence",
  storageBucket: "gvsu-attendence.appspot.com",
  messagingSenderId: "472511270208"
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

  userOrgs = uid => this.db.ref(`users/${uid}/organizations`);

  users = () => this.db.ref('users');

  organizations = () => this.db.ref('organizations');

  meetings = () => this.db.ref('meetings');

  meetingsByOrg = orgId => this.db.ref(`meetings/${orgId}`);

  orgMembers = orgId => this.db.ref(`members/${orgId}`);

  meetingAttendees = (orgId,meetId) => this.db.ref(`meetingAttendees/${orgId}/${meetId}`)
}

export default Firebase;
