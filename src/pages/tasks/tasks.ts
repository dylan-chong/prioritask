import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';
import { EditTaskPage } from '../edit-task/edit-task';

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
    this.tasks = this.userService.tasks();
  }

  public onTaskClicked(task: Task) {
    this.navCtrl.push(EditTaskPage, { strategy: 'edit', task });
  }

}
