import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as firebaseui from "firebaseui";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;

  constructor(
    private afAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit() {
    const uiConfig: firebaseui.auth.Config = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
      }
    };

    this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);

    this.ui.start("#firebase-auth-container", uiConfig);
  }

  ngOnDestroy() {
    this.ui.delete();
  }

  onLoginSuccessful(result) {
    this.ngZone.run(() => this.router.navigate(["/courses"]));
  }
}
