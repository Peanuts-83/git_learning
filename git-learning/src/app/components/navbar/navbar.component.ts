import { BehaviorSubject, Observable, tap, Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'
import { User } from '../../models/user.interface'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public navEntries = ['videoUpload', 'git', 'mongo']
  public isAdmin!: Observable<boolean>
  public userName!: string
  private sub!: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin.pipe(
      tap(value => {
        if (value === true) {
          this.navEntries = ['videoUpload', 'git', 'mongo']
        } else {
          this.navEntries = ['git', 'mongo']
        }
      })
      )
      this.sub = this.isAdmin.subscribe()
      this.sub.add(this.authService.userData.pipe(
        tap((data: User) => this.userName = data?.email),
        tap(r => console.log('name',r))
      ).subscribe()
      )
    }

    ngOnDestroy(): void {
      this.sub.unsubscribe()
    }

}
