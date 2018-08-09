import { Injectable } from '@angular/core';
import { Task, UserService } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TasksService {

  constructor(
    private database: AngularFireDatabase,
    private userService: UserService,
  ) {
  }

  public newBlankTask(): Task {
    // Hack around ionic date time component ignoring time zone of ISO8601 format string
    // https://stackoverflow.com/a/47569053/1726450
    const dueDate = (new Date(Date.now() - new Date().getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, -1);

    return {
      title: '',
      notes: '',
      dueDate,
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
