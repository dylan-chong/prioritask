import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {
  private firebase: any;

  constructor() {
  }

  public initialise() {
    const firebase = (window as any).firebase;

    if (!firebase) {
      setTimeout(() => this.initialise(), 100);
      return;
    }

    firebase.initializeApp({
      apiKey: "AIzaSyADjLJx9GzgiSW8Fdx7X_Pq9ohajlTVIxU",
      authDomain: "prioritask-b3a27.firebaseapp.com",
      databaseURL: "https://prioritask-b3a27.firebaseio.com",
      projectId: "prioritask-b3a27",
      storageBucket: "prioritask-b3a27.appspot.com",
      messagingSenderId: "912663779683"
    });

    this.firebase = firebase;
  }
}
