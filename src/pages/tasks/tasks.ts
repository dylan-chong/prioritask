import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { Observable } from 'rxjs';
import { TasksService, isOverdue } from '../../providers/tasks-service/tasks-service';
import { SettingsPage } from '../settings/settings';

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
    private actionSheetController: ActionSheetController,
    private tasksService: TasksService,
  ) {
    this.tasks = tasksService.tasks;
  }

  public addTask() {
    const strategy = new AddTaskStrategy(this.tasksService);
    const modal = this.modalController.create(EditTaskPage, { strategy });
    modal.present();
  }

  public openTask(taskKey: string, task: Task) {
    const strategy = new EditTaskStrategy(this.tasksService, taskKey, task);
    this.navCtrl.push(EditTaskPage, { strategy });
  }

  public changeTaskCompletion(taskKey: string, isCompleted: boolean) {
    this.tasksService.updateTask(taskKey, { completed: isCompleted });
  }

  public openSettingsPopup() {
    const actionSheet = this.actionSheetController.create({
      title: 'Options',
      buttons: [
        { text: 'Settings', handler: () => this.goToSettings() },
        { text: 'Filters', handler: () => this.goToFilters() },
        { text: 'Cancel', role: 'cancel' },
      ]
    });

    actionSheet.present();
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private goToFilters() {
    // TODO AFTER filters page
    // this.navCtrl.push(FiltersPage);
  }

}
