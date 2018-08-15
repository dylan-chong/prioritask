import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '../user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

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
  const filters: Function[] = [];

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
