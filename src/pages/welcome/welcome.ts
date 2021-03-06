import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/user-service/user-service';
import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  public hasLoaded = false;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private loadingController: LoadingController,
  ) {
  }

  public ionViewDidEnter() {
    const loading = this.loadingController.create();
    loading.present();

    this.userService.tryAutoLogin().subscribe((isLoggedIn) => {
      loading.dismiss();

      if (!isLoggedIn) {
        this.hasLoaded = true;
        return;
      }

      this.navCtrl.setRoot(HomeTabsPage, {}, {
        animate: true,
        direction: 'forward',
      }).then(() => this.hasLoaded = true);
    });
  }

  public start() {
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: true,
      direction: 'forward',
    });
  }

}
