import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
  ) {
  }

  public onSignupClicked() {
    this.userService.signup(this.email, this.password)
      .then(() => {
        this.navCtrl.push(TasksPage);
        // TODO Clear email and password on authentication, not here
        this.email = '';
        this.password = '';
      })
      .catch((e) => {
        // TODO proper error messages customised to be more natural
        this.alertCtrl.create({
          title: 'Error signing up',
          subTitle: (e || {}).message,
          buttons: ['OK'],
        }).present();

        console.error('Error signing up', e);
      });
  }

}
