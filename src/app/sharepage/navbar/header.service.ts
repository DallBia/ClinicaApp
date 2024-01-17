import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public LinkA = new BehaviorSubject<string>('');
  LinkA$ = this.LinkA.asObservable();
  setLinkA(value: string) {
    this.LinkA.next(value);
  }
  getLink(){
    return this.LinkA.value
  }
  linkAtivo: string = '';
}
