import { Injectable } from '@angular/core';
import { Task, UserService } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { assign, mapValues } from 'lodash';
import * as moment from "moment";

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
      priority: 0,
    };
  }

  public get tasks() {
    return this.userService.user.pipe(map(
      ({ tasks }) => mapValues(
        tasks, 
        (task) => assign(this.newBlankTask(), task)
      )
    ));
  }

  public saveNewTask(task: Task) {
    return Observable.fromPromise(
      this.database
        .list(this.databasePath)
        .push(task)
    );
  }

  public updateTask(taskKey: string, task: Partial<Task>) {
    return Observable.fromPromise(
      this.database
        .object(`${this.databasePath}/${taskKey}`)
        .update(task)
    );
  }

  public deleteTask(taskKey: string) {
    return Observable.fromPromise(
      this.database
        .object(`${this.databasePath}/${taskKey}`)
        .remove()
    );
  }

  private get databasePath() {
    return this.userService.databasePath + '/tasks';
  }
}

export const isOverdue = (task: Task) =>
  moment().isSameOrAfter(task.dueDate);
