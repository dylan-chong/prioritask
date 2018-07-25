import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase-service/firebase-service';

export type User = any;
export type Task = any;

@Injectable()
export class UserService {

  private user: User;

  constructor(private firebaseService: FirebaseService) {
  }

  public login(username: string) {
    // TODO Make this return a promise and callers deal with the promise
    // TODO Call firebase

    return this.firebaseService.firebase().then(firebase => {
      return firebase.database()
        .ref('users')
        .child(username) // TODO escaped username
        .once('value')
        .then((snapshot) => {
          console.log(snapshot.val())
          const user = snapshot.val();
          if (!user) {
            throw new Error('User does not exist');
          }

          this.user = user;
        });
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

}
