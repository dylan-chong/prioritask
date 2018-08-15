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
  constructor(
    private database: AngularFireDatabase,
    private authentication: AngularFireAuth,
  ) {
  }

  public tryAutoLogin(): Observable<boolean> {
    return this.authentication.user.first().map((authenticationUser) => {
      return !!authenticationUser;
    });
  }

  public login(email: string, password: string) {
    return this.authentication.auth.signInWithEmailAndPassword(email, password);
  }

  public signup(email: string, password: string) {
    return this.authentication.auth.createUserWithEmailAndPassword(email, password);
  }

  public logOut() {
    if (!this.user) {
      return Promise.resolve();
    }

    return this.authentication.auth.signOut();
  }

  public get user() {
    const userObject = this.database.object(this.databasePath).valueChanges();

    return userObject.pipe(map(
      (user) => assign(this.newBlankUser(), user || {})
    ));
  }

  public get databasePath() {
    return `users/${this.uid}`;
  }

  public get uid() {
    return this.authentication.auth.currentUser.uid;
  }

  private newBlankUser(): User {
    return {
      tasks: [],
      settings: {
        filters: {
          showCompletedTasks: false,
          showIncompleteTasks: true,
        },
      },
    };
  }

}
