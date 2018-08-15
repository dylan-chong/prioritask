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
    console.log(JSON.stringify(partialSettings))
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
