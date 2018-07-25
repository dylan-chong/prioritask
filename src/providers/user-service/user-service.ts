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
    // TODO Make this return a promise and callers deal with the promise
    // TODO Call firebase

    return this.firebaseService.firebase().then(firebase => {
      return firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => this.onAuthenticate(data));
    });
  }

  public tasks() {
    return this.user.tasks;
  }

  public newBlankTask(): Task {
    // TODO Moved to a different class
    return {
      title: '',
    };
  }

  private onAuthenticate(data: any) {
    return this.firebaseService.firebase().then(firebase => { // TODO Replace with angular firebase
      return firebase.database()
        .ref('users/' + data.user.uid)
        .once('value')
        .then((snapshot) => this.user = snapshot.val() || {});
    });
  }

}
