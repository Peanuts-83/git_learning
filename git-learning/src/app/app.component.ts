import { DbConnectService } from './services/db-connect.service'
import { Component, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public selectedFile!: File | null
  public fileNames!: Observable<string[]>
  @ViewChild('loadedFile') lf!: ElementRef<HTMLInputElement>
  @ViewChild('removedFile') rf!: ElementRef<HTMLInputElement>
  private inputs!: ElementRef[]

  constructor(public dbService: DbConnectService) {
    this.fileNames = dbService.fileNames.asObservable()
   }

  /**
   * SELECT file
   * @param event - file (object) or value (string)
   */
  public onSelectFile(event: any) {
    this.inputs = [this.lf, this.rf]
    this.selectedFile = event.target.files ? event.target.files[0] : new File([], event.target.value)
  }

  /**
   * REMOVE DATA
   * @returns
   */
  public onRemoveFile() {
    if (!this.selectedFile) { return }
    this.dbService.deleteFile(this.selectedFile)
    this.initInputs()
  }

  /**
   * ADD DATA
   * @param event
   */
  public onSaveFile() {
    if (!this.selectedFile) { return }
    this.dbService.addFile(this.selectedFile)
    this.initInputs()
  }

  private initInputs() {
    for (let input of this.inputs) {
      input.nativeElement.value = ''
    }
    this.selectedFile = null
  }

}
