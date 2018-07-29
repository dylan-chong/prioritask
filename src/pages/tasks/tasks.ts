import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public tasks: Observable<Task[]>;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
  ) {
    this.tasks = userService.user.pipe(map(
      ({ tasks }) => tasks
    ));
  }

  public onAddClicked() {
    const strategy = new AddTaskStrategy(this.userService);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

  public onTaskClicked(taskKey: string, task: Task) {
    const strategy = new EditTaskStrategy(this.userService, taskKey, task);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

}
