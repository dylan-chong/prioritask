import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

export type User = any;
export type Task = any;

@Injectable()
export class UserService {
  private user: Observable<User>;

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

  public newBlankTask(): Task {
    // TODO Move to a different class
    return {
      title: '',
    };
  }


  private loadUserData(uid: string): Promise<void> {
    const userObject = this.database.object('users/' + uid);
    return userObject.valueChanges()
      .first()
      .toPromise()
      .then((user) => {
        if (user) {
          return;
        }
        return userObject.set(this.newBlankUser());
      })
    .then(() => {
      this.user = userObject.valueChanges();
    });
  }

  private newBlankUser(): User {
    return {
      tasks: [],
    };
  }

}
