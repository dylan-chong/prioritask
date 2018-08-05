import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { Observable } from 'rxjs';
import { TasksService } from '../../providers/tasks-service/tasks-service';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public tasks: Observable<Task[]>;

  constructor(
    public navCtrl: NavController,
    private tasksService: TasksService,
  ) {
    this.tasks = tasksService.tasks;
  }

  public onAddClicked() {
    const strategy = new AddTaskStrategy(this.tasksService);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

  public onTaskClicked(taskKey: string, task: Task) {
    const strategy = new EditTaskStrategy(this.tasksService, taskKey, task);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

}
