import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { Observable } from 'rxjs';
import { TasksService, isOverdue } from '../../providers/tasks-service/tasks-service';
import { SettingsPage } from '../settings/settings';
import { FiltersPage } from '../filters/filters';
import { SettingsService, convertFilterSettings } from '../../providers/settings-service/settings-service';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public tasks: Observable<Task[]>;
  public isOverdue = isOverdue;
  public filters: any[];

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private tasksService: TasksService,
    private settingsService: SettingsService,
  ) {
    this.tasks = tasksService.tasks;

    settingsService.settings.subscribe(({ filters }) => {
      this.filters = convertFilterSettings(filters);
    });
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
        { text: 'Filters', handler: () => this.goToFilters() },
        { text: 'Settings', handler: () => this.goToSettings() },
        { text: 'Cancel', role: 'cancel' },
      ]
    });

    actionSheet.present();
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private goToFilters() {
    this.navCtrl.push(FiltersPage);
  }

}
