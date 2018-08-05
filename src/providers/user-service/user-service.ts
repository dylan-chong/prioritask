import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { assign } from 'lodash';

export type User = { [key: string]: any };
export type Task = { [key: string]: any };

@Injectable()
export class UserService {
  private _user: Observable<User>;

  constructor(
    private database: AngularFireDatabase,
    private authentication: AngularFireAuth,
  ) {
  }

  public login(email: string, password: string) {
    this.requireLoggedOut();
    return this.authentication.auth
      .signInWithEmailAndPassword(email, password)
      .then((data) => this.setupUserObservable(data.user.uid));
  }

  public signup(email: string, password: string) {
    this.requireLoggedOut();
    return this.authentication.auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => this.setupUserObservable(data.user.uid));
  }

  public get user() {
    return this._user;
  }

  private requireLoggedOut() {
    if (this._user) {
      throw new Error('Already logged in');
    }
  }

  private setupUserObservable(uid: string) {
    const userObject = this.database.object('users/' + uid).valueChanges();

    this._user = userObject.pipe(map(
      (user) => assign(this.newBlankUser(), user || {})
    ));
  }

  private newBlankUser(): User {
    return {
      tasks: [],
    };
  }

}
