import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { TasksPage } from '../tasks/tasks';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public username: string;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
  ) {

  }

  public onLoginClick() {
    const username = (this.username || '').trim();
    if (!username) {
      // TODO Disable a login button
      return;
    }

    this.userService.login(username);
    this.navCtrl.push(TasksPage);
  }

}
