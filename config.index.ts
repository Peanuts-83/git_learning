import {writeFile} from 'fs';
import { environment } from 'src/environments/environment.prod'

const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `export const enviroment = {
  ...${environment},
  firebase: {
    ...${environment.firebase},
    ...${process.env['FIREBASE_API_KEY']}
  },
  allowedUser: ${process.env['ALLOWED_USER']},
  alllowedAdmin: ${process.env['ALLOWED_ADMIN']}
};`;

writeFile(targetPath, envConfigFile, 'utf8', err => {
  if (err) console.log(err)
});
