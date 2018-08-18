import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { SignUpPage } from '../sign-up/sign-up';
import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
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

  public canLogin() {
    return this.email && this.password;
  }

  public login() {
    if (!this.canLogin()) {
      return;
    }

    const loading = this.loadingCtrl.create();
    loading.present();

    this.userService.login(this.email, this.password)
      .then(() => {
        this.navCtrl.setRoot(HomeTabsPage, {}, {
          animate: true,
          direction: 'forward',
        });
      })
      .catch((e) => {
        // TODO SOMETIME proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error logging in',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error logging in', e);
      })
      .then(() => loading.dismiss());
  }

  public goToSignup() {
    this.navCtrl.push(SignUpPage, { email: this.email });
  }

}
