import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { Subscription, tap } from 'rxjs'
import { DbConnectService } from 'src/app/services/db-connect.service'
import { ElementRefService } from 'src/app/services/element-ref.service'

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent implements OnInit {
  public selectedFile: File | null = null
  public path!: string
  public activeMovieURL!: any
  public fileNames!: string[]
  public percentLoad!: number
  private subscription!: Subscription
  public addText = 'Add video'
  @ViewChild('loadedFile') loadedFile!: ElementRef<HTMLInputElement>
  public title!: string

  constructor(public dbService: DbConnectService, private router: Router) {}

  ngOnInit(): void {
    this.path = `${this.router.url}/`
    this.dbService.getList(this.path)
    this.subscription = this.dbService.fileNames$.subscribe(result => this.fileNames = result)
    this.title = this.router.url.slice(1)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  /**
   * SELECT file
   * @param event - file (object) or value (string)
   */
   public onSelectFile(event: any) {
    this.selectedFile = event.target.files ? event.target.files[0] : new File([], event.target.value)
    this.onWatchMovie()
  }

  /**
   * WATCH movie
   */
   public onWatchMovie() {
    if (!this.selectedFile) { return }
    this.activeMovieURL = ''
    this.dbService.getFile(this.selectedFile).then(url => {
      if (url) {
        console.log(url)
        this.activeMovieURL = url
      }
    })
  }

}
