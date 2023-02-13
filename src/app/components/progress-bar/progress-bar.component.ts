import { Observable } from 'rxjs'
import { DbConnectService } from './../../services/db-connect.service'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ElementRefService } from 'src/app/services/element-ref.service'

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less']
})
export class ProgressBarComponent implements OnInit {
  public percent$!: Observable<number>
  public isPaused$!: Observable<boolean>
  @Output() onStop = new EventEmitter<null>()

  constructor(public dbService: DbConnectService, private eltRefService: ElementRefService) { }

  ngOnInit(): void {
    this.percent$ = this.dbService.percentUpload
    this.isPaused$ = this.dbService.isPaused.asObservable()
  }

  pause() {
    this.dbService.pauseUpload()
  }

  stop() {
    this.dbService.stopUpload()
    this.onStop.emit()
  }

}
