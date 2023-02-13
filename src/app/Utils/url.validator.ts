import { environment } from './../../environments/environment'
import { AbstractControl } from "@angular/forms"

export function ValidMailName(control: AbstractControl) {
  if(!environment.allowedUser.includes(control.value)) {
    return {invalidUser: true}
  }
  return null
}
