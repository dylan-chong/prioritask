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

    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    const save = this.strategy.save();
    save.subscribe(() => {});

    return save;
  }

  public saveAndLeave() {
    this.save().subscribe(() => this.navCtrl.pop());
  }

  public ionViewCanLeave(): Promise<any> {
    return this.save()
      .catch((e) => {
        this.showCannotLeavePageAlert(e);
        return Observable.throw(e);
      })
      .toPromise();
  }

  public taskInvalidityReason() {
    if (!this.strategy.task.title) {
      return 'Please set a title first';
    }

    return null;
  }

  private showCannotLeavePageAlert(e: any) {
    const invalidityReason = this.taskInvalidityReason();
    if (e !== invalidityReason) {
      console.error('Error leaving page', e);
    }

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
}

export class AddTaskStrategy extends EditTaskPageStrategy {
  private hasSaved = false;
  private saveInProgress?: Observable<any>;

  constructor(private tasksService: TasksService) {
    super('Create Task', tasksService.newBlankTask());
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
