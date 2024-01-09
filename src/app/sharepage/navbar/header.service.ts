import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private LinkA = new BehaviorSubject<string>('');
  LinkA$ = this.LinkA.asObservable();
  setLinkA(value: string) {
    this.LinkA.next(value);
  }
  linkAtivo: string = '';
}
