import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserService, Task } from '../../providers/user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage {
  public strategy: AddTaskStrategy | EditTaskStrategy;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService: UserService,
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

    const save = this.userService.saveTask(this.strategy.task)
      .finally(() => loading.dismiss());
    save.subscribe(() => {});
    return save;
  }

  public ionViewCanLeave() {
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

export class AddTaskStrategy {
  public task: Task;
  public pageTitle = 'Create Task';

  constructor(userService: UserService) {
    this.task = userService.newBlankTask();
  }
}

export class EditTaskStrategy {
  public pageTitle = 'Edit Task';

  constructor(public task: Task) {

  }
}
