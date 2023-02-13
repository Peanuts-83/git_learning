// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'gitlearning-5e584',
    appId: '1:681381798063:web:8ad0fb501442e71363f45a',
    storageBucket: 'gitlearning-5e584.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyDHo3N-kuUHH1jgSYqLzJge9e_cnCKgQ7w',
    authDomain: 'gitlearning-5e584.firebaseapp.com',
    messagingSenderId: '681381798063',
  },
  production: false,
  allowedUser: ['thomas.ranque@arche-mc2.fr','david.ruty@arche-mc2.fr','siffrein.ranque@gmail.com'],
  alllowedAdmin: ['thomas.ranque','siffrein.ranque'],
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
