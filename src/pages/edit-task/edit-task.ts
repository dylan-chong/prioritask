import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {
  public strategy: AddTaskStrategy | EditTaskStrategy;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
  ) {
    this.strategy = this.navParams.get('strategy');
  }

  public save() {
    console.log('save')
    // TODO 
  }

  public ionViewWillLeave() {
    this.save();
  }

  // TODO ionViewCanLeave to make sure the user can't leave the page when saving invalid data
}

export class AddTaskStrategy {
  public task: Task;
  public pageTitle = 'Create Task';

  constructor(userService: UserService) {
    this.task = userService.newBlankTask();
  }
}

export class EditTaskStrategy {
  public pageTitle = 'Edit Task';

  constructor(public task: Task) {

  }
}
