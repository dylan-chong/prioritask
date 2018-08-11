import { Component } from '@angular/core';
import { UserService } from '../../providers/user-service/user-service';
import { NavController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navController: NavController,
    private alertController: AlertController,
    private userService: UserService,
  ) {
  }

  public logOut() {
    const alert = this.alertController.create({
      title: 'Are you sure you want to logout?',
      subTitle: 'We\'ll keep your data safe for your return.',
      buttons: [
        { text: 'Log Out', role: 'destructive', handler: () => this.doLogOut() },
        { text: 'Cancel', role: 'cancel' },
      ]
    });
    alert.present();
  }

  private doLogOut() {
    // TODO are you sure you want to logout
    this.userService.logOut().then(() => {
      this.navController.setRoot(LoginPage, {}, {
        animate: true,
        direction: 'backwards',
      });
    });
  }

}
