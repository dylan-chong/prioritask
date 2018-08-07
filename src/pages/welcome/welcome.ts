import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController) {
  }

  public start() {
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: true,
      direction: 'forward',
    });
  }

}
