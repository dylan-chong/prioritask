import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private user: { username: string };

  constructor() {
    console.log('Hello UserService Provider');
  }

  public login(username: string) {
    this.user = { username };
  }

}
