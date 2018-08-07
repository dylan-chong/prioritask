import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Task } from '../../providers/user-service/user-service';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TasksService } from '../../providers/tasks-service/tasks-service';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {
  public strategy: EditTaskPageStrategy;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.strategy = this.navParams.get('strategy');
  }

  public save() {
    const invalidityReason = this.taskInvalidityReason();
    if (invalidityReason) {
      return Observable.throw(invalidityReason);
    }

    const loading = this.loadingCtrl.create(
      // { dismissOnPageChange: true }
    );
    loading.present();

    return this.strategy.save().first().finally(() => {
      loading.dismiss();
    });
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
}

abstract class EditTaskPageStrategy {
  constructor(public pageTitle: string, public task: Task) {
  }

  public abstract save(): Observable<any>;
  public abstract canLeavePage(EditTaskPage: any): Promise<any> | boolean;
}

export class AddTaskStrategy extends EditTaskPageStrategy {
  public readonly hasCancelButton = true;
  public readonly hasSaveButton = true;

  private hasSaved = false;
  private saveInProgress?: Observable<any>;

  constructor(private tasksService: TasksService) {
    super('Create Task', tasksService.newBlankTask());
  }

  public canLeavePage(editTaskPage: EditTaskPage): Promise<any> | boolean {
    // TODO show confirmation when the android back button is pressed and task is invalid
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
}

export class EditTaskStrategy extends EditTaskPageStrategy {
  private saveInProgress?: Observable<any>;

  constructor(
    private tasksService: TasksService,
    private taskKey: string,
    task: Task
  ) {
    super('Edit Task', cloneDeep(task));
  }

  public canLeavePage(editTaskPage: EditTaskPage): Promise<any> | boolean {
    const save = editTaskPage.save();
    save.subscribe(() => {});
    return save.toPromise();
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
}
