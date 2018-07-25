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

  public email: string;
  public password: string;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onLoginClick() {
    this.userService.login(this.email, this.password)
      .then(() => {
        this.navCtrl.push(TasksPage);
        this.email = '';
        this.password = '';
      })
      .catch((e) => {
        // TODO proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error signing in',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error logging in', e);
      });

    // TODO loading clerk block
  }

}
