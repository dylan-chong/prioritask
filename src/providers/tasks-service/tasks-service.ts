import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable()
export class TasksService {

  constructor(
    private database: AngularFireDatabase,
    private authentication: AngularFireAuth,
  ) {
  }

  public newBlankTask(): Task {
    return {
      title: '',
    };
  }

  public saveNewTask(task: Task) {
    const uid = this.authentication.auth.currentUser.uid;// TODO 
    return Observable.fromPromise(
      this.database
        .list(`users/${uid}/tasks`)
        .push(task)
    );
  }

  public updateTask(taskKey: string, task: Task) {
    const uid = this.authentication.auth.currentUser.uid;
    return Observable.fromPromise(
      this.database
        .object(`users/${uid}/tasks/${taskKey}`)
        .set(task)
    );
  }

}
