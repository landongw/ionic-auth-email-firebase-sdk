import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {
  constructor() {}

  loginUser(email: string, password: string): Promise<firebase.User> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async signupUser(email: string, password: string): Promise<firebase.User> {
    try {
      const newUser: firebase.User = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await firebase
        .database()
        .ref(`/userProfile/${newUser.uid}/email`)
        .set(email);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.auth().signOut();
  }
}
