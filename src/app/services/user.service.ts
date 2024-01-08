import { Observable, Subject, of } from 'rxjs';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TokenService } from "./token.service";
import {Colaborador} from '../models/Colaboradors'
import jwt_decode from 'jwt-decode';
import { Router } from "@angular/router";
import { User } from '../models';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Response } from '../models/Response';
import { HttpClient } from '@angular/common/http';
import { TableProf } from '../models/Tables/TableProf';
import { ModalSenhaProvComponent } from '../pages/login/modal-senha-prov/modal-senha-prov.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn:'root'
})
export class UserService {

  public troca: string = 'Esqueci a senha / Trocar senha'
  public btnEntrar: boolean = false;




  public usuario = new BehaviorSubject<string>('new User');
  usuario$ = this.usuario.asObservable();
  setUsuario(name: string) {
    this.usuario.next(name);
  }


  public ValidarUsr = new BehaviorSubject<boolean|undefined>(undefined);
  ValidarUsr$ = this.ValidarUsr.asObservable();
  setValidarUsr(name: boolean) {
    this.ValidarUsr.next(name);
  }
  getValidarUsr(){
    return this.ValidarUsr.value
  }

  public UsrLogA = new BehaviorSubject<string>('new User');
  UsrLogA$ = this.UsrLogA.asObservable();

  //ESTA VARIÁVEL GUARDA E ATUALIZA O USUÁRIO ATUAL
  public UsrA = new BehaviorSubject<User>(new User);
  UsrA$ = this.UsrA.asObservable();


  public userSubject = new BehaviorSubject<User | null>(null);

  private userLogged = new BehaviorSubject<boolean>(false);

  public alertas = false;

  constructor(private tokenService: TokenService,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient){

    if(this.tokenService.hasToken())
      this.decodeAndNotify();
  }

  setToken(token: string){

    this.tokenService.setToken(token);
    this.decodeAndNotify();

  }


  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser(){
    return this.userSubject.asObservable();
  }

  public decodeAndNotify() {
    //this.router.navigate(['/login']);
    const token: string = this.tokenService.getToken();
    const user = jwt_decode(token) as User;
    this.userSubject.next(user);
    this.userLogged.next(true);
    this.setUserA(user)
    const Uid = user.userid !== undefined ? Number(user.userid) || 0 : 0;
    this.setEquipeA(Uid)

  }









  public equipe: TableProf[] = [];
  public equipeG: Colaborador[] = [];
  // public EquipeAtual: User[] = [];
  // public EquipeN: number = 0;

 private apiurl = `${environment.ApiUrl}/User`
  GetEquipe() : Observable<Response<Colaborador[]>>{
    return this.http.get<Response<Colaborador[]>>(this.apiurl);
  }
  CreateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
    return this.http.post<Response<Colaborador[]>>(`${this.apiurl}/Novo` , Equipe);
  }
  UpdateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
    return this.http.put<Response<Colaborador[]>>(`${this.apiurl}/Editar` , Equipe);
  }

  private EquipeAtual = new BehaviorSubject<User>(new User);
  EquipeAtual$ = this.EquipeAtual.asObservable();
  setEquipeAtual(name: User) {
    this.EquipeAtual.next(name);
  }

  private EquipeA = new BehaviorSubject<number>(0);
  EquipeA$ = this.EquipeA.asObservable();
  setEquipeA(name: number) {
    this.EquipeA.next(name);
  }
  getEquipeA(){
    return this.EquipeA
  }


  // setUserA(UsrLog: any): Observable<string | null> {
  setUserA(UsrLog: any): Observable<string | null> {
    let Perf: string = '';
    if (UsrLog == null){
    UsrLog = this.getUserA().getValue();
    }
    if(UsrLog !== null){
      const UsrName = UsrLog.name;
      if(UsrLog.perfil?.toString() == '0') {
        Perf = 'Diretoria';
        }
        if(UsrLog.perfil?.toString() == '1') {
          Perf = 'Secretaria';
        }
        if(UsrLog.perfil?.toString() == '2') {
          Perf = 'Coordenação';
        }
        if(UsrLog.perfil?.toString() == '3') {
          Perf = 'Equipe Clínica';
        }
        this.setUsuario(UsrName + ' (' + Perf + ')');
        return of(UsrName + ' (' + Perf + ')');
      }
      else{
        return of("(usuário)")
      }
  }

  getUserA() {
    return this.userSubject;
  }


  logout() {

    this.tokenService.removeToken();
    this.userSubject.next(null);
    this.userLogged.next(false);
    this.router.navigate(['']);
    localStorage.clear();

  }

  isLogged() {
    return this.tokenService.hasToken();
  }

  get isLoggedIn() {
    return this.userLogged.asObservable();
  }


  AlteraSenha(email: string) : Observable<Response<Colaborador>>{
    const apiurllogin = `${environment.ApiUrl}/Colaborador/Altera`;
    return this.http.post<Response<Colaborador>>(apiurllogin, email);
  }



}
