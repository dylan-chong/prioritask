import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

export type User = any;
export type Task = any;

@Injectable()
export class UserService {

  private user: User;

  constructor(
    private database: AngularFireDatabase,
    private authentication: AngularFireAuth,
  ) {
  }

  public login(email: string, password: string) {
    if (this.user) {
      throw new Error('Already logged in');
    }

    return this.authentication.auth
      .signInWithEmailAndPassword(email, password)
      .then((data) => this.loadUserData(data.user.uid));
  }

  public signup(email: string, password: string) {
    if (this.user) {
      throw new Error('Already logged in');
    }

    return this.authentication.auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => this.loadUserData(data.user.uid));
  }

  private loadUserData(uid: string) {
    return this.database.database
      .ref('users/' + uid)
      .once('value')
      .then((snapshot) => this.user = snapshot.val() || {});
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
