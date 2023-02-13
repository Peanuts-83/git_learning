import { DbConnectService } from './services/db-connect.service'
import { Component, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core'
import { Observable, Subscription, BehaviorSubject, tap, share } from 'rxjs'
import { ListResult } from '@angular/fire/storage'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedFile: File | null = null
  public destinationFolder$ = this.dbService.folderPath$
  public fileNames$!: Observable<string[]>
  public activeMovieURL!: any
  @ViewChild('movie') movie!: ElementRef<HTMLVideoElement>

  @ViewChild('removedFile') rf!: ElementRef<HTMLInputElement>
  private inputs!: ElementRef[]

  constructor(public dbService: DbConnectService) { }

  ngOnInit(): void {
    this.fileNames$ = this.dbService.fileNames$.pipe(
      // une seule subscription mise en commun
      share()
    )
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe()
  }

  private initInputs() {
    if (this.inputs?.length) {
      for (let input of this.inputs) {
        input.nativeElement.value = ''
      }
    }
    this.selectedFile = null
  }

  /**
   * SELECT file
   * @param event - file (object) or value (string)
   */
   public onSelectFile(event: any) {
    // this.inputs = [this.lf, this.rf]
    this.selectedFile = event.target.files ? event.target.files[0] : new File([], event.target.value)
  }


  /**
   * REMOVE DATA
   * @returns
   */
  public onRemoveFile() {
    this.dbService.deleteFile(this.selectedFile)
    this.initInputs()
  }

  /**
   * WATCH movie
   */
  public onWatchMovie() {
    if (!this.selectedFile || this.selectedFile.name.split('.')[1] !== 'mp4') { return }
    this.activeMovieURL = ''
    this.dbService.getFile(this.selectedFile).then(url => {
      if (url) {
        console.log(url)
        this.activeMovieURL = url
      }
    })
  }
}
