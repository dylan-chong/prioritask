import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { Observable } from 'rxjs';
import { TasksService, isOverdue } from '../../providers/tasks-service/tasks-service';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public tasks: Observable<Task[]>;
  public isOverdue = isOverdue;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private tasksService: TasksService,
  ) {
    this.tasks = tasksService.tasks;
  }

  public onAddClicked() {
    const strategy = new AddTaskStrategy(this.tasksService);
    const modal = this.modalController.create(EditTaskPage, { strategy });
    modal.present();
  }

  public onTaskClicked(taskKey: string, task: Task) {
    const strategy = new EditTaskStrategy(this.tasksService, taskKey, task);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

  public changeTaskCompletion(taskKey: string, isCompleted: boolean) {
    this.tasksService.updateTask(taskKey, { completed: isCompleted });
  }

}
