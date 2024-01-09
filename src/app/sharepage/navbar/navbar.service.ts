import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  // BehaviorSubject para controlar a visibilidade da barra de navegação
  private showNavbarSubject = new BehaviorSubject<boolean>(true);
  showNavbar$ = this.showNavbarSubject.asObservable();



  constructor(public userService: UserService,
    ) { }

  toggleNavbar(show: boolean): void {
    this.showNavbarSubject.next(show);
  }
}
