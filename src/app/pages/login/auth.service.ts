import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { tap, catchError, map, Observable, throwError, of, BehaviorSubject } from "rxjs";
//import { tap } from 'rxjs';
import { TokenService } from "../../services/token.service";
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { UserService } from "../../services/user.service";
import { environment } from 'src/environments/environment';
import{NavbarComponent } from '../../sharepage/navbar/navbar.component'

  const API = `${environment.ApiUrl}`

  @Injectable({  providedIn: 'root'})
  export class AuthService {

    constructor(private http: HttpClient,
                private userService: UserService,
                private tokenService: TokenService,
                private router: Router) {

    }

    authenticate(userName: string, password: string) {

      const body = {
        Usuario: userName,
        Senha: password
      };
      return this.http
      .post(
          API + '/User',body, { observe: 'response' }
      )
      .pipe(tap(res => {
          const authToken = res.body as any;
          this.userService.setToken(authToken.token);
          this.userService.setUser(authToken);
          this.userService.decodeAndNotify()
       }))

    }



  }

