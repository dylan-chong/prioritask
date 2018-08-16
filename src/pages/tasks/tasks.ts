import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, ToastController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { TasksService, isOverdue } from '../../providers/tasks-service/tasks-service';
import { SettingsPage } from '../settings/settings';
import { FiltersPage } from '../filters/filters';
import { SettingsService, convertFilterSettings, TaskGroup, TaskPair } from '../../providers/settings-service/settings-service';
import { KeyValuePipe } from '../../pipes/key-value/key-value';
import { GroupTasksPipe, } from '../../pipes/group-tasks/group-tasks';
import { map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public taskGroups: TaskGroup[] = [];
  public unfilteredTaskPairs: TaskPair[] = [];
  public isOverdue = isOverdue;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private tasksService: TasksService,
    private settingsService: SettingsService,
  ) {
    this.initialiseTaskList();
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
    const setCompleted = (completed: boolean) =>
      this.tasksService.updateTask(taskKey, { completed });

    setCompleted(isCompleted);

    if (!isCompleted) {
      return;
    }

    const toast = this.toastController.create({
      message: 'Task completed!',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Undo',
      dismissOnPageChange: true,
    });
    toast.onDidDismiss((data, role) => {    
      if (role !== 'close') {
        return;
      }

      setCompleted(false);
    });

    toast.present();
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

  private initialiseTaskList() {
    const taskPairsObservable = this.tasksService.tasks.pipe(
      map(tasksObject => {
        this.unfilteredTaskPairs = new KeyValuePipe().transform(tasksObject);
        return this.unfilteredTaskPairs;
      }),
      startWith([]),
    );

    const filtersObservable = this.settingsService.settings.pipe(
      map(({ filters }) => {
        return convertFilterSettings(filters);
      }),
      startWith([]),
    );

    combineLatest(taskPairsObservable, filtersObservable)
      .subscribe(([taskPairs, filters]) => {
        this.taskGroups = new GroupTasksPipe().transform(taskPairs, filters);
      });
  }
}
