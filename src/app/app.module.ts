import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { UserService } from '../providers/user-service/user-service';
import { TasksPage } from '../pages/tasks/tasks';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { FirebaseService } from '../providers/firebase-service/firebase-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TasksPage,
    EditTaskPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TasksPage,
    EditTaskPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserService,
    FirebaseService,
  ]
})
export class AppModule { }
