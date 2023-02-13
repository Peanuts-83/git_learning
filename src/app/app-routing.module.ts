import { UploadComponent } from './components/upload/upload.component'
import { VideoComponent } from './components/video/video.component'
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import { HomeComponent } from './components/home/home.component'

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'git', component: VideoComponent, canActivate: [AuthGuard]},
  {path: 'mongo', component: VideoComponent, canActivate: [AuthGuard]},
  {path: 'videoUpload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo:'/home', pathMatch: 'full'},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
