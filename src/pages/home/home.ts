import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { TasksPage } from '../tasks/tasks';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [TasksPage],
})
export class HomePage { // TODO Renamed to login page

  public username: string;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onLoginClick() {
    this.userService.login(this.username, this.password)
      .then(() => this.navCtrl.push(TasksPage))
      .catch((e) => {
        this.alertCtrl.create({
          title: 'Error signing in',
          // TODO proper error messages customised to be more natural
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();
      });

    // TODO loading clerk block
  }

}
