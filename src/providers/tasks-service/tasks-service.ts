import { Injectable } from '@angular/core';
import { Task, UserService } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class TasksService {

  constructor(
    private database: AngularFireDatabase,
    private userService: UserService,
  ) {
  }

  public newBlankTask(): Task {
    return {
      title: '',
      notes: '',
      completed: false,
      dueDate: moment().toISOString(),
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

  public updateTask(taskKey: string, task: Partial<Task>) {
    return Observable.fromPromise(
      this.database
        .object(`users/${this.userService.uid}/tasks/${taskKey}`)
        .update(task)
    );
  }
}

export const isOverdue = (task: Task) =>
  moment().isSameOrAfter(task.dueDate);
