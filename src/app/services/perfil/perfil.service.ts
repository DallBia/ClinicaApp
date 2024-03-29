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
import { Tipo } from 'src/app/models/Tipo';


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


    // validaPerfil(id: number, n: number): boolean{
    //   return true
    // }

    validaPerfil(tipo: number, n: number, id?: number): boolean{   //o id é o id que se deseja consultar (0 para nenhum, 1 para cliente e 2 pra Colaborador); o n é o item da Definição de perfil
      let resp: boolean = true;
      let id0: string | null = '0';
      switch (tipo){
        case (1):
          id0 = window.localStorage.getItem('nCli');
          break;
        case (2):
          id0 = window.localStorage.getItem('nCol');
          break;
        default:
          id0 = '0';
      }
      try{
        tipo = id0 !== null ? parseInt(id0) : 0;
      }catch{
        tipo = 0
      }
      try{

        const nId = window.sessionStorage.getItem('Perfil' + n.toString());
        const idUser = window.sessionStorage.getItem('nUsr');
        const idU = id !== undefined ? id.toString() : '0'
        switch (nId){
          case ('S'):
            resp = true;
            break;
          case ('N'):
            resp = false;
            break;
          case ('X'):
            resp = idUser == idU ? true : false;
            break;
          default:
            resp = false;
            break;
        }

      }catch{
        resp = false;
      }
        return resp;
        //return resp;
    }


    public ps: Perfil[] = []
    guardaPerfil(): boolean{
       this.GetPerfil().subscribe(data => {
      const dados = data.dados;
      dados.map((item) => {
        item.dir !== null ? item.dir = item.dir : item.dir = false;
        item.secr !== null ? item.secr = item.secr : item.secr = false;
        item.coord !== null ? item.coord = item.coord : item.coord = false;
      })
      this.ps = data.dados;
      const pf = parseInt(window.sessionStorage.getItem('nPrf') || '3')
      this.ps.sort((a, b) => a.id - b.id);
      this.perfils = this.ps;
      for (let i of this.ps){

     let nome: boolean = false;

      switch (pf){
        case (0):
          nome = i.dir !== undefined ? i.dir : false;
        break;
        case (1):
          nome = i.secr !== undefined ? i.secr : false;
        break;
        case (2):
          nome = i.coord !== undefined ? i.coord : false;
        break;
        case (3):
          nome = i.equipe !== undefined ? i.equipe : false;
        break;
        default:
        nome = false;
      }
        let valor: string = '';
        if (nome == true){
          valor = 'S'
        }else{
          valor = i.siMesmo == true ? 'X' : 'N';
        }

        const nId = 'Perfil' + i.id.toString();
        window.sessionStorage.setItem(nId, valor);
      }

    });
    return true;
    }




}
