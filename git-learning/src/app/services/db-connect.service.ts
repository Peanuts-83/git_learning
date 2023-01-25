import { Injectable } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import {
  Storage,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
  ref,
  listAll,
  list,
  StorageReference
} from '@angular/fire/storage'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DbConnectService {
  public fileNames = new BehaviorSubject<string[]>([''])
  public dbRef = ref(this.storage, '')

  constructor(private auth: Auth, private storage: Storage) {
    list(this.dbRef).then(r => {
      this.fileNames.next(r.items.map(item => item.name))
    })
  }

  /**
   * REMOVE DATA
   * @returns
   */
  public deleteFile(file: File) {
    if (file.name.length === 0) { return }
    deleteObject(ref(this.storage, file.name))
      .then(ok => console.log(`Succes deleting ${file.name}`))
      .catch(err => alert(`Error deleting ${file.name} -` + err))
  }

  /**
   * ADD DATA
   * @param event
   */
  public addFile(file: File) {
    const storageRef = ref(this.storage, file.name)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", {
      next: (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes)
        console.log(('Upload is ' + progress + '% done'))
      },
      error: (error) => { console.log('Upload failed. ' + error) },
      complete: () => {
        getDownloadURL(uploadTask.snapshot.ref).then(dlUrl => {
          console.log('File available at ' + dlUrl)
        })
      }
    })
  }

}
