import { NgModule } from '@angular/core';
import { KeyValuePipe } from './key-value/key-value';
import { GroupTasksPipe } from './group-tasks/group-tasks';
@NgModule({
  declarations: [
    KeyValuePipe,
    GroupTasksPipe,
  ],
  imports: [],
  exports: [
    KeyValuePipe,
    GroupTasksPipe,
  ]
})
export class PipesModule {}
