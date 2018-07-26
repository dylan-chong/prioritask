import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { TasksPage } from '../tasks/tasks';
import { SignUpPage } from '../sign-up/sign-up';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  entryComponents: [
    TasksPage,
    SignUpPage,
  ],
})
export class LoginPage { // TODO Renamed to login page

  public email: string;
  public password: string;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onLoginClicked() {
    // TODO loading click block
    this.userService.login(this.email, this.password)
      .then(() => {
        this.navCtrl.push(TasksPage);
        // TODO Clear email and password on authentication, not here
        // TODO disable the back button
        this.email = '';
        this.password = '';
      })
      .catch((e) => {
        // TODO proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error logging in',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error logging in', e);
      });
  }

  public onSignupClicked() {
    this.navCtrl.push(SignUpPage);
  }

}
