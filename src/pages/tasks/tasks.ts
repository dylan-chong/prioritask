import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, ToastController, NavParams, App } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { EditTaskPage, EditTaskStrategy, AddTaskStrategy } from '../edit-task/edit-task';
import { TasksService, isOverdue } from '../../providers/tasks-service/tasks-service';
import { SettingsPage } from '../settings/settings';
import { FiltersPage } from '../filters/filters';
import { SettingsService, convertFilterSettings, TaskGroup, TaskPair } from '../../providers/settings-service/settings-service';
import { KeyValuePipe } from '../../pipes/key-value/key-value';
import { GroupTasksPipe } from '../../pipes/group-tasks/group-tasks';
import { map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  public hasCalendar: any;
  public calendarDate: Moment = moment();
  private calendarFilterObservable: Subject<any>;

  public hasLoadedTasks = false;
  public taskGroups: TaskGroup[] = [];
  public unfilteredTaskPairs: TaskPair[] = [];
  public isOverdue = isOverdue;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private appController: App,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private tasksService: TasksService,
    private settingsService: SettingsService,
  ) {
    this.initialiseTaskList();

    this.hasCalendar = this.navParams.get('hasCalendar');
    if (this.hasCalendar) {
      this.updateCalendarFilter();
    }
  }

  public addTask() {
    const strategy = new AddTaskStrategy(this.tasksService);
    const modal = this.modalController.create(EditTaskPage, { strategy });
    modal.present();
  }

  public openTask(taskKey: string, task: Task) {
    const strategy = new EditTaskStrategy(this.tasksService, taskKey, task);
    this.appController.getRootNav().push(EditTaskPage, { strategy });
  }

  public changeTaskCompletion(taskKey: string, shouldMarkCompleted: boolean) {
    const setCompleted = (completed: boolean) =>
      this.tasksService.updateTask(taskKey, { completed });

    setCompleted(shouldMarkCompleted);

    const toast = this.toastController.create({
      message: shouldMarkCompleted ? 'Task completed!' : 'Task marked incomplete',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Undo',
      dismissOnPageChange: true,
    });
    toast.onDidDismiss((data, role) => {
      if (role !== 'close') {
        return;
      }

      setCompleted(!shouldMarkCompleted);
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

  public updateCalendarFilter() {
    if (!this.hasCalendar) {
      return;
    }

    const filters = [taskPairs => {
      return taskPairs.filter(pair => 
        moment(pair.value.dueDate).isSame(this.calendarDate, 'day')
      );
    }];

    this.calendarFilterObservable.next(filters);
  }

  private goToSettings() {
    this.appController.getRootNav().push(SettingsPage);
  }

  private goToFilters() {
    this.appController.getRootNav().push(FiltersPage);
  }

  private initialiseTaskList() {
    const taskPairsObservable = this.tasksService.tasks.pipe(
      map(tasksObject => {
        this.unfilteredTaskPairs = new KeyValuePipe().transform(tasksObject);
        return this.unfilteredTaskPairs;
      }),
    );

    const filtersObservable = this.settingsService.settings.pipe(
      map(({ filters }) => convertFilterSettings(filters)),
    );

    this.calendarFilterObservable = new Subject();

    combineLatest(
      taskPairsObservable,
      filtersObservable,
      this.calendarFilterObservable.pipe(startWith([])),
    ).subscribe(([taskPairs, filters, calendarFilters]) => {
      this.hasLoadedTasks = true;
      this.taskGroups = new GroupTasksPipe().transform(
        taskPairs,
        [...filters, ...calendarFilters],
      );
    });
  }
}
