import { Injectable } from '@angular/core'
import {
  Storage,
  UploadTask,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
  ref,
  listAll,
  list,
  StorageReference,
  ListResult,
  uploadBytes,
  UploadTaskSnapshot,
  StorageError,
} from '@angular/fire/storage'
import { SnapshotOptions } from 'firebase/firestore'
import { BehaviorSubject } from 'rxjs'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class DbConnectService {
  public fileNames: BehaviorSubject<string[]> = new BehaviorSubject([''])
  public fileNames$ = this.fileNames.asObservable()
  public folderPath$ = new BehaviorSubject('')
  public percentUpload = new BehaviorSubject(0)
  public isPaused = new BehaviorSubject(false)
  private uploadTask!: UploadTask

  constructor(private storage: Storage) {
    this.getList()
  }

  /**
   * GETLIST
   * @param path - Option pour lister un path différent de l'actuel
   */
  public getList(path?: string): void {
    path!==null && path!==undefined ? this.folderPath$.next(path) : null
    list(ref(this.storage, this.folderPath$.value))
      .then((r: ListResult) => {
        this.fileNames.next(r.items.map(item => item.name))
      })
      .catch(e => console.log(e))
  }

  /**
   * ADD DATA
   * @param file - Fichier a tranférer
   */
  public addFile(file: File) {
    const destinationFile = this.folderPath$.value + file.name
    const storageRef = ref(this.storage, destinationFile)
    const metadata = { contentType: 'video/mp4' }
    // uploadBytesResumable se lance immédiatement
    this.uploadTask = uploadBytesResumable(storageRef, file, metadata)
    // Pause de la tache le temps de setter le stateChanged
    this.uploadTask.pause()
    this.uploadTask.on("state_changed", {
      next: (snapshot: UploadTaskSnapshot) => {
        const l_percentLoad = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
        this.percentUpload.next(l_percentLoad)
      },
      error: (error) => { console.log('Upload failed. ' + error) },
      complete: () => {
        console.log(`File uploaded`)
        return true
      }
    })
    // Lance upload.resume() en fin de cycle, depuis l'exterieur de la methode (récupère le this?)
    setTimeout(() => this.doUpload())
  }

  /**
   * UPLOAD Action
   */
  public doUpload() {
    this.uploadTask.resume()
    this.uploadTask.then(
      (snapshot: UploadTaskSnapshot) => {
        this.percentUpload.next(0)
        this.getList()
      },
      (error: StorageError) => {
        this.percentUpload.next(0)
        this.getList()
        alert('Error on upload task -' + error.message)
      }
    )
  }

  /**
   * PAUSE Upload
   */
  pauseUpload() {
    this.isPaused.next(!this.isPaused.value)
    console.log('PAUSE?', this.isPaused.value)
    if (this.isPaused.value) {
      this.uploadTask.pause()
    } else {
      this.uploadTask.resume()
    }
  }

  /**
   * STOP Upload
   */
  stopUpload() {
    this.uploadTask.resume()
    this.uploadTask.cancel()
  }

  /**
   * REMOVE DATA
   * if file === null - all files in current folder are deleted
   * if file === File | string - one file is deleted
   */
  public deleteFile(file: File | string | null) {
    if (file === null) {
      const confirmText = 'Warning! All data will be erased from storage, please confirm.'
      if (confirm(confirmText) === true) {
        const filesNum = this.fileNames.value.length
        this.fileNames.value.forEach((el, n) => {
          deleteObject(ref(this.storage, this.folderPath$.value + el)).then(
            () => {
              console.log(`Succes deleting ${el}`)
              if (n === filesNum - 1) {
                this.getList()
              }
            }
          )
        })
      } else {
        return
      }
      return
    }
    const confirmText = 'Warning! Selected file will be erased, please confirm.'
    if (confirm(confirmText) === true) {
      const l_fileName = typeof file === 'string' ? file : file.name
      deleteObject(ref(this.storage, this.folderPath$.value + l_fileName))
        .then(ok => {
          console.log(`Succes deleting ${l_fileName}`)
          this.getList()
        }
        )
        .catch(e => alert(`Error deleting ${l_fileName}.` + e))
    } else {
      return
    }
  }

  /**
   * GET DATA
   * @param file - Fichier vidéo à lire
   * @param path - Option pour changer de folder
   */
  public getFile(file: File, path?: string): Promise<string> {
    return getDownloadURL(ref(this.storage, (path ? path : this.folderPath$.value) +  file.name))
  }

}
