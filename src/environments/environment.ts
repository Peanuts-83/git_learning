import { ALLOWED_ADMIN, ALLOWED_USER, FIREBASE_API_KEY } from "./environment.protected"

export const environment = {
  production: false,
  firebase: {
    projectId: 'gitlearning-5e584',
    appId: '1:681381798063:web:8ad0fb501442e71363f45a',
    storageBucket: 'gitlearning-5e584.appspot.com',
    locationId: 'europe-west',
    apiKey: FIREBASE_API_KEY.apiKey,
    authDomain: 'gitlearning-5e584.firebaseapp.com',
    messagingSenderId: '681381798063',
  },
  allowedUser: ALLOWED_USER.allowedUser,
  alllowedAdmin: ALLOWED_ADMIN.allowedAdmin,
};
