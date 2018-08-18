import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TasksPage } from '../tasks/tasks';

@Component({
  selector: 'page-home-tabs',
  templateUrl: 'home-tabs.html'
})
export class HomeTabsPage {

  public listRoot = TasksPage;
  public daysRoot = TasksPage;

  constructor(public navCtrl: NavController) {}

}
