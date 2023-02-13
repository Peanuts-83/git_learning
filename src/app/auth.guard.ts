import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { UploadComponent } from './components/upload/upload.component'
import { VideoComponent } from './components/video/video.component'
import { User } from './models/user.interface'
import { AuthService } from './services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, public router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['login'])
    }
    // VideoUpload disabled for non admin users
    const l_user = this.authService.userData
    if (!environment.alllowedAdmin.some(name => l_user.value?.email?.includes(name))) {
      this.router.resetConfig([
        { path: 'login', component: LoginComponent },
        { path: 'home', component: HomeComponent },
        { path: 'git', component: VideoComponent, canActivate: [AuthGuard] },
        { path: 'mongo', component: VideoComponent, canActivate: [AuthGuard] },
        { path: '**', redirectTo: '/home', pathMatch: 'full' },
      ])
    } else {
      this.router.resetConfig([
        {path: 'login', component: LoginComponent},
        {path: 'home', component: HomeComponent},
        {path: 'git', component: VideoComponent, canActivate: [AuthGuard]},
        {path: 'mongo', component: VideoComponent, canActivate: [AuthGuard]},
        {path: 'videoUpload', component: UploadComponent, canActivate: [AuthGuard]},
        {path: '**', redirectTo:'/home', pathMatch: 'full'},
      ])
    }
    return true
  }

}
