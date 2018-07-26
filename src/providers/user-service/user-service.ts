import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase-service/firebase-service';

export type User = any;
export type Task = any;

@Injectable()
export class UserService {

  private user: User;

  constructor(private firebaseService: FirebaseService) {
  }

  public login(email: string, password: string) {
    if (this.user) {
      throw new Error('Already logged in');
    }

    return this.firebaseService.firebase().then(firebase => {
      return firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => this.loadUserData(data.user.uid));
    });
  }

  public signup(email: string, password: string) {
    if (this.user) {
      throw new Error('Already logged in');
    }

    return this.firebaseService.firebase().then(firebase => {
      return firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((data) => this.loadUserData(data.user.uid));
    });
  }

  private loadUserData(uid: string) {
    return this.firebaseService.firebase().then(firebase => {
      return firebase.database()
        .ref('users/' + uid)
        .once('value')
        .then((snapshot) => this.user = snapshot.val() || {});
    });
  }

  public tasks() {
    return this.user.tasks;
  }

  public newBlankTask(): Task {
    // TODO Move to a different class
    return {
      title: '',
    };
  }

}
