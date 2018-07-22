import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksPage } from './tasks';

@NgModule({
  declarations: [
    TasksPage,
  ],
  imports: [
    IonicPageModule.forChild(TasksPage),
  ],
  entryComponents: [
    TasksPage,
  ],
  exports: [
    TasksPage,
  ],
})
export class TasksPageModule {}
