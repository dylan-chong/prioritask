import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
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
    private userService: UserService,
    private database: AngularFireDatabase,
  ) {
    this.strategy = this.navParams.get('strategy');
  }

  public save() {
    if (!this.isTaskValid()) {
      return Promise.reject('Invalid task data');
    }

    const loading = this.loadingCtrl.create();
    loading.present();

    const save = this.userService.saveTask(this.strategy.task)
      .finally(() => loading.dismiss());
    save.subscribe(() => {});
    return save;
  }

  public ionViewWillLeave() {
    return this.save();
  }

  public isTaskValid() {
    return !!this.strategy.task.title;
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
