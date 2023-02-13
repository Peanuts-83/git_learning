import { ElementRef, Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class ElementRefService {

  constructor() {}

  public initInput(input: ElementRef) {
    input.nativeElement.value = ''
  }
}
