import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { TasksPage } from '../tasks/tasks';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [TasksPage],
})
export class HomePage {

  public username: string;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onLoginClick() {
    const username = (this.username || '').trim();
    if (!username) {
      // TODO Disable a login button
      return;
    }

    this.userService.login(username)
      .then(() => this.navCtrl.push(TasksPage))
      .catch((e) => {
        console.error(e);
        this.alertCtrl.create({
          title: 'User does not exist',
          subTitle: 'Have you signed up yet?',
          buttons: ['OK'],
        }).present();
      });
    // TODO loading clerk block
  }

}
