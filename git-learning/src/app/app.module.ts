import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'


import { AppComponent } from './app.component'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { environment } from '../environments/environment'
import { provideStorage, getStorage } from '@angular/fire/storage'
import { provideAuth } from '@angular/fire/auth'
import { getAuth } from '@angular/fire/auth'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
