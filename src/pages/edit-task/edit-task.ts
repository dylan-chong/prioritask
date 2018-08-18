import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TasksService } from '../../providers/tasks-service/tasks-service';
import * as moment from 'moment';
import { CalendarModalOptions, CalendarModal, CalendarResult } from 'ion2-calendar';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {
  public strategy: PageStrategy;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalController: ModalController,
  ) {
    this.strategy = this.navParams.get('strategy');
  }

  public save() {
    const invalidityReason = this.taskInvalidityReason();
    if (invalidityReason) {
      return Observable.throw(invalidityReason);
    }

    const loading = this.loadingCtrl.create();
    loading.present();

    return this.strategy.save().finally(() => loading.dismiss());
  }

  public cancelAndLeave() {
    this.navCtrl.pop();
  }

  public saveAndLeave() {
    this.save().subscribe(
      () => this.navCtrl.pop(),
      () => this.showCannotLeavePageAlert(),
    );
  }

  public deleteAndLeave() {
    const performDelete = () => {
      this.strategy.deleteTask().subscribe(() => this.navCtrl.pop());
    };

    const alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete this task?',
      subTitle: `It will be gone for ever.`,
      buttons: [
        { text: 'Delete the task', handler: performDelete },
        { text: 'Cancel', role: 'cancel' },
      ]
    });
    alert.present();
  }

  public ionViewCanLeave(): Promise<any> | boolean {
    return this.strategy.canLeavePage(this);
  }

  public taskInvalidityReason() {
    if (!this.strategy.task.title) {
      return 'Please set a title first';
    }

    return null;
  }

  public showCannotLeavePageAlert() {
    const invalidityReason = this.taskInvalidityReason();
    this.alertCtrl.create({
      title: 'Cannot save task',
      subTitle: invalidityReason,
      buttons: ['OK'],
    }).present();
  }

  public selectDate() {
    const options: CalendarModalOptions = {
      title: 'Select Due Date',
      defaultDate: moment(this.strategy.task.dueDate).toDate(),
      canBackwardsSelected: true,
    };
    const myCalendar = this.modalController.create(CalendarModal, { options });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (type === 'cancel') {
        return;
      }

      const oldDueDate = moment(this.strategy.task.dueDate);
      const newDueDate = moment(date.dateObj).set({
        hour: oldDueDate.get('hour'),
        minute: oldDueDate.get('minute'), 
        second: oldDueDate.get('second')
      });

      this.strategy.task.dueDate = newDueDate.toISOString();
    })
  }

  public dateIgnoringTime() {
    return moment(this.strategy.task.dueDate).format('dddd, MMMM Do YYYY');
  }

  // Hack around ionic date time component ignoring time zone of ISO8601 format string
  public get localDueDate() {
    return moment(this.strategy.task.dueDate).format();
  }

  // See the documentation for the getter
  public set localDueDate(newDate: string) {
    this.strategy.task.dueDate = moment(newDate).toISOString();
  }
}

abstract class PageStrategy {
  constructor(public pageTitle: string, public task: Task) {
  }

  public abstract save(): Observable<any>;
  public abstract deleteTask(): Observable<any>;
  public abstract canLeavePage(EditTaskPage: any): Promise<any> | boolean;
}

export class AddTaskStrategy extends PageStrategy {
  public readonly hasCancelButton = true;
  public readonly hasSaveButton = true;

  private hasSaved = false;
  private saveInProgress?: Observable<any>;

  constructor(private tasksService: TasksService) {
    super('Create Task', tasksService.newBlankTask());
  }

  public canLeavePage(editTaskPage: EditTaskPage): Promise<any> | boolean {
    // TODO SOMETIME show confirmation when the android back button is pressed and task is invalid
    return true;
  }

  public save(): Observable<any> {
    if (this.hasSaved) {
      return Observable.empty();
    }

    if (this.saveInProgress) {
      return this.saveInProgress;
    }

    this.saveInProgress = this.tasksService.saveNewTask(this.task);
    this.saveInProgress.subscribe(() => {
      this.hasSaved = true;
      this.saveInProgress = null;
    });

    return this.saveInProgress;
  }

  public deleteTask(): Observable<any> {
    throw new Error('Unsupported operation');
  }
}

export class EditTaskStrategy extends PageStrategy {
  public readonly hasDeleteButton = true;

  private saveInProgress?: Observable<any>;
  private hasDeleted = false;

  constructor(
    private tasksService: TasksService,
    private taskKey: string,
    task: Task
  ) {
    super('Edit Task', cloneDeep(task));
  }

  public canLeavePage(editTaskPage: EditTaskPage): Promise<any> | boolean {
    if (this.hasDeleted) {
      return true;
    }

    return new Promise((resolve, reject) => {
      editTaskPage.save().subscribe(resolve, () => {
        editTaskPage.showCannotLeavePageAlert();
        reject();
      });
    });
  }

  public save(): Observable<any> {
    if (this.saveInProgress) {
      return this.saveInProgress;
    }

    this.saveInProgress = this.tasksService.updateTask(this.taskKey, this.task);
    this.saveInProgress.subscribe(() => {
      this.saveInProgress = null;
    });
    return this.saveInProgress;
  }

  public deleteTask(): Observable<any> {
    return this.tasksService.deleteTask(this.taskKey).map(() => {
      this.hasDeleted = true;
    });
  }
}
