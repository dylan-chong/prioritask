import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { TasksPage } from '../tasks/tasks';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  entryComponents: [
    TasksPage,
  ],
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
      .then(() => this.navCtrl.setRoot(TasksPage))
      .catch((e) => {
        // TODO proper error messages customised to be more natural
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
