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
import { SignUpPage } from '../pages/sign-up/sign-up';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { PipesModule } from '../pipes/pipes.module';
import { TasksService } from '../providers/tasks-service/tasks-service';
import { WelcomePage } from '../pages/welcome/welcome';
import { firebaseConfig } from '../config';
import { SettingsPage } from '../pages/settings/settings';
import { FiltersPage } from '../pages/filters/filters';
import { SettingsService } from '../providers/settings-service/settings-service';
import { CalendarModule } from "ion2-calendar";
import { NgInputPasswordComponent } from 'ng-input-password/ng-input-password';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    TasksPage,
    EditTaskPage,
    WelcomePage,
    SettingsPage,
    FiltersPage,
    HomeTabsPage,
    NgInputPasswordComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CalendarModule,
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    TasksPage,
    EditTaskPage,
    WelcomePage,
    SettingsPage,
    FiltersPage,
    HomeTabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserService,
    TasksService,
    SettingsService,
  ]
})
export class AppModule { }
