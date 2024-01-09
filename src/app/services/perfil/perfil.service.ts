import { Perfil } from './../../models/Perfils';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { TableData } from 'src/app/models/Tables/TableData';
import { TabResult } from 'src/app/models/Tables/TabResult';
import { UserService } from '../user.service';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  public Vazia: Perfil[] = [{
  id: 0,
  descricao: '',
  help: '',
  dir: false,
  secr: false,
  coord: false,
  equipe: false,
  siMesmo: false
    }];
  constructor(private http: HttpClient,
              private user: UserService,
    ) { }


    public perfils: Perfil[] = [];
    private apiurl = `${environment.ApiUrl}/Perfil`


    GetPerfil() : Observable<Response<Perfil[]>>{
      return this.http.get<Response<Perfil[]>>(this.apiurl);
    }

    UpdatePerfil(perfil: Perfil) : Observable<Response<Perfil[]>>{
      return this.http.put<Response<Perfil[]>>(`${this.apiurl}/Editar`, perfil);
    }

    private PerfilAtual = new BehaviorSubject<Perfil>(this.Vazia[0]);
    PerfilAtual$ = this.PerfilAtual.asObservable();
    setPerfilAtual(name: Perfil) {
      this.PerfilAtual.next(name);
    }
    private Ajuda = new BehaviorSubject<string>('');
      Ajuda$ = this.Ajuda.asObservable();
      setAjuda(name: string) {
        this.Ajuda.next(name);
    }


    validaPerfil(id: number, n: number): boolean{
      return true
    }

    // validaPerfil(id: number, n: number): boolean{
    //   let resp: boolean = true;
    //     const UsrLog = this.user.getUserA().getValue();
    //     let p: boolean[] = [false, false, false, false, false];

    //     if (UsrLog !== null){
    //       const usuario = UsrLog.userid !== undefined ? parseInt(UsrLog.userid) : 0;
    //       const perfil = UsrLog.perfil !== undefined ? parseInt(UsrLog.perfil) : 3;
    //       for (let x of this.perfils){
    //         if (x.id == n){
    //           p = [x.dir ? x.dir : false, x.secr ? x.secr : false, x.coord ? x.coord : false, x.equipe ? x.equipe : false, x.siMesmo ? x.siMesmo : false]
    //         }
    //       }
    //       if(perfil == 3 && p[4] == true){
    //         if(id == usuario){
    //           resp = true;
    //         }
    //       }else{
    //         resp = p[perfil]
    //       }
    //       console.log('perfil: '+ perfil)
    //       console.log('p perfil:' + p[perfil])
    //       console.log('Id / Usuário: ' + id + '/' + usuario)
    //     }
    //     return true;
    //     //return resp;
    // }
}
