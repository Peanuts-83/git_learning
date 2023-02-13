import { environment } from './../../environments/environment.prod'
import { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs'
import * as auth from 'firebase/auth';
import { Injectable, NgZone } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Firestore } from '@angular/fire/firestore'
import { Auth, getAuth, user, UserCredential } from '@angular/fire/auth'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { User } from '../models/user.interface'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData = new BehaviorSubject<any>(null) // Save logged in user data
  public isAdmin = new BehaviorSubject<boolean>(false)

  constructor(private afApp: AngularFirestore, private afAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) {
    /* Saving user data in sessionstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData.next(user)
        if (environment.alllowedAdmin.some(name => user?.email?.includes(name)) && this.isLoggedIn) {
          this.isAdmin.next(true)
        }
        sessionStorage.setItem('lzUser', JSON.stringify(this.userData.value))
        JSON.parse(sessionStorage.getItem('lzUser')!)
      } else {
        sessionStorage.setItem('lzUser', 'null')
        JSON.parse(sessionStorage.getItem('lzUser')!)
      }
    })
  }

  // SignIn with email/password
  public signIn(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.setUserData(result.user)
        this.afAuth.authState.subscribe(user => {
          if (user && this.isLoggedIn) {
            this.isAdmin.next(environment.alllowedAdmin.some(name => user?.email?.includes(name)) && this.isLoggedIn ? true : false)
            this.router.navigate(['/home'])
          }
        })
        return this.isLoggedIn
      })
      .catch(error => window.alert(error.message))
  }

  // SignUp with email/password
  public signUp(email: string, password: string): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        // Check for authorized users in env.allowedUser
        if (result.user?.email && !environment.allowedUser.includes(result.user.email)) {
          window.alert('User not allowed!')
          return
        }
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail()
        this.setUserData(result.user)
      })
      .catch(error => window.alert(error.message))
  }

  private sendVerificationMail(): Promise<boolean> {
    return this.afAuth.currentUser
      .then(user => user?.sendEmailVerification())
      .then(() => this.router.navigate(['verify-email'])) // component additionnel
  }

  public forgotPassword(passwordResetEmail: string): Promise<any> {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => window.alert('Email envoyé. Consultez vos e-mails.'))
      .catch(error => window.alert(error.message))
  }

  public get isLoggedIn(): boolean {
    const user: User = JSON.parse(sessionStorage.getItem('lzUser')!)
    return user !== null && user.uid !== null ? true : false
  }

  public googleAuth(): Promise<boolean> {
    return this.authLogin(new auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['home']))
  }

  private authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then(result => {
        this.router.navigate(['/home'])
      })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  private setUserData(user: any): Promise<any> {
    const userRef: AngularFirestoreDocument<any> = this.afApp.doc(`users/${user.uid}`)
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
    }
    this.userData.next(userData)
    console.log(user.PhotoURL, userData)
    return userRef.set(userData, { merge: true })
  }

  // SignOut
  public signOut(): Promise<any> {
    return this.afAuth.signOut()
      .then(() => {
        sessionStorage.removeItem('lzUser')
        this.isAdmin.next(false)
        this.router.navigate(['/login'])
        return false
      })
  }
}
