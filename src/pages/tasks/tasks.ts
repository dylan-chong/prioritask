import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {

  public tasks: Task[] = [];

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
  ) {
  }

  public ionViewDidLoad() {
    this.tasks = this.userService.tasks();
  }

  public onTaskClicked(task: Task) {

  }

}
