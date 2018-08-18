import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService, Task } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';
import * as moment from "moment";

export interface TaskPair {
  key: string;
  value: Task;
}

export interface TaskGroup {
  title: string;
  tasks: TaskPair[];
}

@Injectable()
export class SettingsService {

  constructor(
    private database: AngularFireDatabase,
    private userService: UserService,
  ) {
  }

  public get settings() {
    return this.userService.user.pipe(map(
      ({ settings }) => settings
    ));
  }

  public updateSettings(partialSettings: any) {
    return Observable.fromPromise(
      this.database
        .object(this.databasePath)
        .update(partialSettings)
    );
  }

  private get databasePath() {
    return this.userService.databasePath + '/settings';
  }

}

export const convertFilterSettings = (filterSettings: any) => {
  const filters: ((pairs: TaskPair[]) => TaskPair[])[] = [];

  filters.push(taskPairs => {
    return sortBy(taskPairs, (pair) => moment(pair.value.dueDate).unix());
  });

  if (!filterSettings.showCompletedTasks) {
    filters.push(taskPairs => {
      return taskPairs.filter(({ value: task }) => !task.completed)
    });
  }

  if (!filterSettings.showIncompleteTasks) {
    filters.push(taskPairs => {
      return taskPairs.filter(({ value: task }) => task.completed)
    });
  }

  return filters;
};
