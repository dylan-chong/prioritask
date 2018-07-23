import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {
  public task: any;
  public strategy: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
  ) {
    this.strategy = this.navParams.get('strategy');

    // TODO Re factor into strategy object
    if (this.strategy === 'add') {
      this.task = this.userService.newBlankTask();
    } else {
      this.task = this.navParams.get('task');
    }
  }

  public onCreateClicked() {
    // TODO 
  }

}

