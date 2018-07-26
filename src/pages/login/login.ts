import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
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
export class LoginPage {

  public email: string;
  public password: string;

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onLoginClicked() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.userService.login(this.email, this.password)
      .then(() => this.navCtrl.push(TasksPage)) // TODO disable the back button
      .catch((e) => {
        // TODO proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error logging in',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error logging in', e);
      })
      .then(() => loading.dismiss());
  }

  public onSignupClicked() {
    this.navCtrl.push(SignUpPage, { email: this.email });
  }

}
