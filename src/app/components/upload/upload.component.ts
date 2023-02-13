import { ElementRefService } from './../../services/element-ref.service'
import { Subscription, tap } from 'rxjs'
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { DbConnectService } from 'src/app/services/db-connect.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit, OnDestroy {
  public selectedFile: File | null = null
  public destinationFolder$ = this.dbService.folderPath$
  public fileNames!: string[]
  public foldersDest = [{key:'root',path:'/'},{key:'git/',path:'/git/'},{key:'mongo/',path:'/mongo/'}]
  public percentLoad!: number
  private subscription!: Subscription
  public addText = 'Add video'
  public title!: string
  @ViewChild('loadedFile') loadedFile!: ElementRef<HTMLInputElement>
  @ViewChild('destination') destination!: ElementRef<HTMLSelectElement>

  constructor(public dbService: DbConnectService, private eltRefService: ElementRefService, private router: Router) {}

  ngOnInit(): void {
    this.dbService.getList('')
    this.subscription = this.dbService.fileNames$.subscribe(result => this.fileNames = result)
    this.subscription.add(this.dbService.percentUpload.pipe(
      tap(r => {
        if (r===100 && this.loadedFile !== undefined && this.loadedFile !== null) {
          this.emptySelectedFile()
        }
      })
    ).subscribe())
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
  }

  /**
   * SELECT destination
   * La liste des videos est actualisé au changement de répertoire
   */
  public onSelectDest(event: any) {
    this.destinationFolder$.next(event.target.value)
    this.dbService.getList()
  }

  /**
   * ADD DATA to Storage
   */
  public onSaveFile() {
    if (this.selectedFile === null || this.selectedFile == undefined) { return }
    if (this.fileNames.includes(this.selectedFile.name)) {
      this.emptySelectedFile()
      this.addText = 'Already in storage !'
      setTimeout(() => this.addText = 'Add video', 1500)
      return
    }
    this.dbService.addFile(this.selectedFile)

  }

  /**
   * DELETE file from Storage
   */
  public onDelete(event: Event, fileName?: string ) {
    event.stopPropagation()
    this.dbService.deleteFile(fileName || null)
  }

  /**
   * Empty input value
   */
  public emptySelectedFile() {
    this.eltRefService.initInput(this.loadedFile)
    this.selectedFile = null
  }

}
