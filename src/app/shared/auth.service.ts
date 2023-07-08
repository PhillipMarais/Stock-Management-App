import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  /*Login METHOD
  -User logs into account and if successful
  user will be navigated to the dashboard, otherise
  they will be navigated to the login.
  @params
  -email : user's email
  -password : user's password
  */
  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem('token', 'true');
        if (res.user?.emailVerified == true) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('token', JSON.stringify(res.user.uid));
        } else {
          this.router.navigate(['/varify-email']);
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  /*Register METHOD
  -User registers their account and if successful
  user will be navigated to the login, otherise
  they will be navigated to the register.
  @params
  -email : user's email
  -password : user's password
  */
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Registration Successful.');
        this.router.navigate(['/login']);
        this.sendEmailForVerification(res.user);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  /*sendEmailForVerification METHOD
  -User registers their account and if successful
  user will be navigated to the login, otherise
  they will be navigated to the register.
  @params
  -email : user's email
  -password : user's password
  */
  sendEmailForVerification(user: any) {
    user.sendEmailForVerification().then(
      (res: any) => {
        this.router.navigate(['/varify-email']);
      },
      (err: any) => {
        alert('Something went wrong.');
      }
    );
  }

  /*Log Out METHOD
  -Sign user out of their account and if successful
  user will be navigated to the login.
  */
  logout() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login ']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  /*Log Out METHOD
  -Sign user out of their account and if successful
  user will be navigated to the login.
  */
  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/varify-email']);
      },
      (err) => {
        alert('Something went wrong.');
        this.router.navigate(['/register']);
      }
    );
  }

  //Log in with google
  googleLogin() {
    this.fireAuth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
