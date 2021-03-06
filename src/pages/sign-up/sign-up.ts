import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public email: string;
  public password: string;
  public confirmationPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
    this.email = navParams.get('email') || '';
  }

  public signup() {
    if (!this.canSignup()) {
      return;
    }

    const loading = this.loadingCtrl.create();
    loading.present();

    this.userService.signup(this.email, this.password)
      .then(() => {
        this.navCtrl.setRoot(HomeTabsPage, {}, {
          animate: true,
          direction: 'forward',
        });
      })
      .catch((e) => {
        // TODO SOMETIME proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error signing up',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error signing up', e);
      })
      .then(() => loading.dismiss());
  }

  public canSignup() {
    return this.email && this.password && this.passwordsMatch();
  }

  public passwordsMatch() {
    return this.password === this.confirmationPassword;
  }

}
