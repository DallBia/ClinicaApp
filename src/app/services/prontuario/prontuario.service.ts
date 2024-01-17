import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { TableProntClin } from './../../models/Tables/TableProntClin';
import { Prontuario } from 'src/app/models/Prontuarios';
import { TableData } from 'src/app/models/Tables/TableData';
import { Tipo } from 'src/app/models/Tipo';
import { HeaderService } from 'src/app/sharepage/navbar/header.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { ClienteService } from '../cliente/cliente.service';


@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {
    public rota!: string;
    private apiurl = `${environment.ApiUrl}/Prontuario`
    public prontuario: Prontuario[] = [];
    public Atual!: TableData;
    public tipo: string = '';
    public dataSource: TableProntClin[] = [];
    public ListaPerfil: Tipo[] | undefined = []
    public ListaNome:  Tipo[] | undefined = []
    public ListaCliente: Tipo[] = [];
    public Ficha: string = 'FICHA';
    public nCliente: number = 0;
    public nomeCliente: string = '';
    public nome: string = '';
    public vSalva = true;



 constructor(private http: HttpClient,
          private headerService: HeaderService,
          private colaboradorService: ColaboradorService,
          private clienteService: ClienteService,

  ) { }

  private prontuarioG = new BehaviorSubject<Prontuario[]>([]);
  prontuarioG$ = this.prontuarioG.asObservable();
  setProntuarioG(name: Prontuario[]) {
    this.prontuarioG.next(name);
  }
  getProntuarioG(){
    return this.prontuarioG.value
  }

  GetProntuario() : Promise<Response<Prontuario[]> | undefined>{
    return this.http.get<Response<Prontuario[]>>(this.apiurl).toPromise();
  }
  CreateProntuario(prontuario: Prontuario) : Observable<Response<Prontuario[]>>{
    return this.http.post<Response<Prontuario[]>>(`${this.apiurl}` , prontuario);
  }
  UpdateProntuario(prontuario: Prontuario) : Observable<Response<Prontuario[]>>{
    return this.http.put<Response<Prontuario[]>>(`${this.apiurl}/Editar` , prontuario);
  }
  GetProntuarioByTipo(tipo: string): Observable<Response<Prontuario[]>> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<Response<Prontuario[]>>(`${this.apiurl}/tipo`, { params });
  }
  async GetColabByTipo(tipo: string): Promise<Tipo[]> {
    let resp: Tipo[] = [];
    const response = await this.http.get<Response<Tipo[]>>(`${environment.ApiUrl}/Colaborador/Agenda/${tipo}`).toPromise();
    if (response && response.dados !== undefined && response.sucesso) {
      resp = response.dados
    }
    return resp;
  }
  async GetCliByTipo(tipo: string): Promise<Tipo[]> {
    let resp: Tipo[] = [];
    const response = await this.http.get<Response<Tipo[]>>(`${environment.ApiUrl}/Cliente/Agenda/${tipo}`).toPromise();
    if (response && response.dados !== undefined && response.sucesso) {
      resp = response.dados
    }
    return resp;
  }

  async getPront(): Promise<boolean>{
    let r = false
    try{
      const data = await this.GetProntuario();
      if (data !== undefined){
        this.prontuario = data.dados;
        for (let i of this.prontuario){
          i.dtInsercao = new Date(i.dtInsercao)
        }
        this.prontuario.sort((a, b) => (a.dtInsercao - b.dtInsercao));
      }
      return true;
    }catch{
      return false
    }
  }






  async iniciar()
  {
    let resp: boolean  = false
    const linkA = this.headerService.LinkA.getValue()
      switch (linkA){
        case ('PRONTUÁRIO CLÍNICO'):
          this.tipo = 'clínico'
          this.rota = '/protclin'
          break;
        case ('PRONTUÁRIO ADMINISTRATIVO'):
          this.tipo = 'administrativo'
          this.rota = '/protadm'
          break;
        case ('CONTROLE FINANCEIRO'):
          this.tipo = 'financeiro'
          this.rota = '/controleFinaceiro'
          break;
        default:
          this.tipo = ''
          this.rota = '/inicio'
      }

      if(this.tipo !== ''){
        try{
          this.ListaPerfil = await this.colaboradorService.GetColabByTipo('perfil');
          this.ListaNome = await this.colaboradorService.GetColabByTipo('nome');
          this.ListaCliente = await this.GetCliByTipo('nome')
          console.log(this.ListaNome)
          console.log(this.ListaPerfil)
          if (this.ListaPerfil == undefined){
            this.ListaPerfil = [];
          }
          if (this.ListaNome == undefined){
            this.ListaNome = [];
          }
          if (this.ListaCliente == undefined){
            this.ListaCliente = [];
          }
        }catch{
          this.ListaPerfil = [];
          this.ListaNome = [];
          this.ListaCliente = [];
        }
      }
    try{
      resp = await this. getPront();
    }catch{

    }
    try {
      const cliTmp = window.sessionStorage.getItem('nCli')
      if(cliTmp !== null){
        this.Ficha = cliTmp
        this.nCliente = parseInt(cliTmp);
      }else{
        this.nCliente = 0
      }
    }catch{
      this.nCliente = 0
    }
    console.log('Em protclin: ' + this.nCliente)
    if(this.nCliente !== 0){
      for (let i of this.ListaCliente){
        if (i.id == this.nCliente){
          this.nome = i.nome;
          this.nomeCliente = i.nome.toUpperCase();
          break;
        }
      }
      }else{
      this.Ficha = 'FICHA';
      this.nomeCliente = '';
    }
    if (resp == true){
      this.setProntuarioG(this.prontuario);

    }
  }



}
