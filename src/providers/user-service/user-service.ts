import { Injectable } from '@angular/core';

export type User = any;
export type Task = any;

@Injectable()
export class UserService {

  private user: User;

  constructor() {
  }

  public login(username: string) {
    const tasks = [
      // TODO Remove temporary tasks
      {
        title: 'Go to the dentist',
      },
      {
        title: 'Create mobile app',
      },
    ];

    this.user = { username, tasks };
  }

  public tasks() {
    return this.user.tasks;
  }

  public newBlankTask(): Task {
    // TODO Moved to a different class
    return {
      title: '',
    };
  }

}
