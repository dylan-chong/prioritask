import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';

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

  public onAddClicked() {
    const strategy = new AddTaskStrategy(this.userService);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

  public onTaskClicked(task: Task) {
    const strategy = new EditTaskStrategy(task);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

}
