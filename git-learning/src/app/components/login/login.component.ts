import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { User } from 'src/app/models/user.interface'
import { AuthService } from 'src/app/services/auth.service'
import { ValidMailName } from 'src/app/Utils/url.validator'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<{ email: FormControl<string | null>, password: FormControl<string | null> }>
  isSubmitted = false;
  isLoggedIn!: boolean
  title!: string

  constructor(
    private authService: AuthService,
    private router: Router, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, ValidMailName]],
      password: ['', Validators.required]
    })
    this.isLoggedIn = this.authService.isLoggedIn
    this.title = this.router.url.slice(1)
  }

  get formControls() { return this.loginForm.controls }

  public doLogin() {
    console.log(this.loginForm.value)
    this.isSubmitted = true
    if (this.loginForm.invalid) {
      return
    }
    this.authService.signIn(this.loginForm.value.email!, this.loginForm.value.password!)
      .then(result => {
        console.log('LOGGEDIN-', result)
        this.isLoggedIn = result
      })
  }

  public doLogout() {
    console.log('LOGGEDIN State -', this.isLoggedIn)
    this.authService.signOut()
      .then(result => {
        console.log('LOGGEDIN-', result)
        this.isLoggedIn = result
      })
  }

}
