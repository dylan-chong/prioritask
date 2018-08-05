import { Injectable } from '@angular/core';
import { Task, UserService } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TasksService {

  constructor(
    private database: AngularFireDatabase,
    private authentication: AngularFireAuth,
    private userService: UserService,
  ) {
  }

  public newBlankTask(): Task {
    return {
      title: '',
    };
  }

  public get tasks() {
    return this.userService.user.pipe(map(
      ({ tasks }) => tasks
    ));
  }

  public saveNewTask(task: Task) {
    return Observable.fromPromise(
      this.database
        .list(`users/${this.userService.uid}/tasks`)
        .push(task)
    );
  }

  public updateTask(taskKey: string, task: Task) {
    return Observable.fromPromise(
      this.database
        .object(`users/${this.userService.uid}/tasks/${taskKey}`)
        .set(task)
    );
  }

}
